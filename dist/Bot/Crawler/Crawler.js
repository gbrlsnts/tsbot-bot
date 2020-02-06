"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const ChannelUtils_1 = require("../Utils/ChannelUtils");
class Crawler {
    constructor(bot, repository, config) {
        this.bot = bot;
        this.repository = repository;
        this.config = config;
        this.bootTimer = 30;
        this.isBooted = false;
    }
    boot() {
        if (this.isBooted)
            return;
        this.startTimer();
        this.isBooted = true;
    }
    reload(config) {
        // apply config and reload
    }
    startTimer() {
        if (this.timer)
            timers_1.clearTimeout(this.timer);
        const interval = this.getTimerInterval();
        this.timer = setTimeout(this.crawl.bind(this), interval);
        console.log(`Next crawl to run in ${interval / 1000} seconds`);
    }
    getTimerInterval() {
        if (this.isBooted)
            return this.config.interval * 1000;
        return this.bootTimer * 1000;
    }
    async crawl() {
        console.log('starting crawl...');
        try {
            const channelList = await this.bot.getServer().channelList();
            const emptyChannelList = [];
            this.config.zones.forEach(zone => {
                const channelsInZone = ChannelUtils_1.ChannelUtils.getTopChannelsBetween(channelList, zone.start, zone.end, !zone.spacerAsSeparator);
                if (!channelsInZone.hasStart || !channelsInZone.hasEnd)
                    throw new Error(`Unable to find start or end in zone ${zone.name}`);
                const zoneEmptyChannels = channelsInZone.channels.filter(channel => {
                    return !ChannelUtils_1.ChannelUtils.isChannelSpacer(channel.name) &&
                        ChannelUtils_1.ChannelUtils.countChannelTreeTotalClients(channel, channelList) === 0;
                }).map(channel => channel.cid);
                emptyChannelList.push({
                    zone: zone.name,
                    empty: zoneEmptyChannels,
                    total: channelsInZone.channels.length
                });
            });
            console.log('Empty channels list:', emptyChannelList.map(c => c.empty));
            await this.updateChannelsState(emptyChannelList);
        }
        catch (e) {
            console.log(`Crawl error: ${e.message}`);
        }
        finally {
            this.startTimer();
            console.log('crawl ended');
        }
    }
    async updateChannelsState(emptyChannelList) {
        const prevCrawl = await this.repository.getPreviousCrawl();
        const emptyChannelIds = Array.prototype.concat.apply([], emptyChannelList.map(zoneResult => zoneResult.empty));
        let prevCrawlChannels = await this.repository.getCrawlerEmptyChannels();
        if (prevCrawl) {
            const secondsFromPrevCrawl = Math.round((new Date().getTime() - prevCrawl.runAt.getTime()) / 1000);
            // filter out channels no longer in the empty list and then add empty time
            prevCrawlChannels = this.getChannelsStillEmpty(prevCrawlChannels, emptyChannelIds);
            prevCrawlChannels.forEach(channel => {
                channel.timeEmpty += secondsFromPrevCrawl;
                channel.lastUpdated = new Date();
            });
        }
        const newEmptyChannels = this.getNewEmptyChannels(prevCrawlChannels, emptyChannelIds);
        const finalEmptyChannelList = [...prevCrawlChannels, ...newEmptyChannels];
        await this.repository.addPreviousCrawl({
            runAt: new Date(),
            zones: emptyChannelList.map(zoneResult => {
                return {
                    zone: zoneResult.zone,
                    emptyChannels: zoneResult.empty.length,
                    totalChannels: zoneResult.total
                };
            }),
        });
        await this.repository.setCrawlerEmptyChannels(finalEmptyChannelList);
        await this.verifyChannelsToDelete(finalEmptyChannelList);
    }
    getChannelsStillEmpty(previousCrawlChannels, currentCrawlIds) {
        // filter out channels no longer in the empty list
        return previousCrawlChannels.filter(prev => {
            return currentCrawlIds.find(id => id == prev.channelId);
        });
    }
    getNewEmptyChannels(previousCrawlChannels, currentCrawlIds) {
        // filter out channels in previous crawls and initialize empty time
        return currentCrawlIds.filter(emptyChannel => {
            // id can't be in previous crawls
            return previousCrawlChannels.every(prev => prev.channelId !== emptyChannel);
        })
            .map(channel => {
            return {
                channelId: channel,
                timeEmpty: 0,
                lastUpdated: new Date()
            };
        });
    }
    async verifyChannelsToDelete(empyChannelList) {
        // for each zone, check which exceed the time limit
        // delete or emit event for those that exceeded
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=Crawler.js.map