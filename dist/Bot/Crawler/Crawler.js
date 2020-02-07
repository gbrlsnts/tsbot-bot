"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const ChannelUtils_1 = require("../Utils/ChannelUtils");
const ProcessResult_1 = require("./ProcessResult");
class Crawler {
    constructor(bot, config) {
        this.bot = bot;
        this.config = config;
        this.bootTimer = 30;
        this.isBooted = false;
        this.isRunning = false;
    }
    boot() {
        if (this.isBooted)
            return;
        this.startTimer();
        this.isBooted = true;
    }
    reload(config) {
        if (!this.isRunning) {
            this.config = config;
            return;
        }
        this.onCrawlEnd = () => this.config = config;
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
        this.isRunning = true;
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
            const processResult = new ProcessResult_1.ProcessResult(emptyChannelList);
            const results = await processResult.processResults();
            this.raiseChannelEvents(results);
        }
        catch (e) {
            console.log(`Crawl error: ${e.message}`);
        }
        finally {
            this.startTimer();
            console.log('crawl ended');
            this.isRunning = false;
            if (this.onCrawlEnd) {
                this.onCrawlEnd();
                this.onCrawlEnd = undefined;
            }
        }
    }
    raiseChannelEvents(result) {
        const botEvents = this.bot.getBotEvents();
        result.forEach(({ zone, channels }) => {
            const config = this.config.zones.find(conf => conf.name === zone);
            if (!config)
                return;
            channels
                .filter(channel => this.channelExceededNotifyTime(config, channel))
                .forEach(channel => botEvents.raiseChannelInactiveNotify(channel.channelId, config.inactiveIcon));
            channels
                .filter(channel => this.channelExceededMaxTime(config, channel))
                .forEach(channel => botEvents.raiseChannelInactiveDelete(channel.channelId));
        });
    }
    channelExceededNotifyTime(zone, channel) {
        return channel.timeEmpty >= zone.timeInactiveNotify && channel.timeEmpty < zone.timeInactiveMax;
    }
    channelExceededMaxTime(zone, channel) {
        return channel.timeEmpty >= zone.timeInactiveMax;
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=Crawler.js.map