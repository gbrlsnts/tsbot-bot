"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const ChannelUtils_1 = require("../Utils/ChannelUtils");
const ProcessResult_1 = require("./ProcessResult");
const ChannelCleanup_1 = require("./ChannelCleanup");
class Crawler {
    constructor(bot, config) {
        this.bot = bot;
        this.config = config;
        this.bootTimer = 30;
        this.isBooted = false;
        this.isRunning = false;
    }
    /**
     * Boot the crawler
     */
    boot() {
        if (this.isBooted)
            return;
        this.startTimer();
        this.isBooted = true;
    }
    /**
     * Reload the crawler config
     * @param config the config to apply
     */
    reload(config) {
        if (!this.isRunning) {
            this.config = config;
            return;
        }
        this.onCrawlEnd = () => this.config = config;
    }
    /**
     * Start the crawl timer
     */
    startTimer() {
        if (this.timer)
            timers_1.clearTimeout(this.timer);
        const interval = this.getTimerInterval();
        this.timer = setTimeout(this.crawl.bind(this), interval);
        console.log(`Next crawl to run in ${interval / 1000} seconds`);
    }
    /**
     * Get the interval to run the crawl timer
     */
    getTimerInterval() {
        if (this.isBooted)
            return this.config.interval * 1000;
        return this.bootTimer * 1000;
    }
    /**
     * Do a crawl
     */
    async crawl() {
        console.log('starting crawl...');
        this.isRunning = true;
        try {
            const channelList = await this.bot.getServer().channelList();
            const emptyChannelList = [];
            this.config.zones.forEach(zone => {
                const channelsInZoneResult = ChannelUtils_1.ChannelUtils.getZoneTopChannels(channelList, zone.start, zone.end, !zone.spacerAsSeparator);
                if (channelsInZoneResult.isLeft()) {
                    console.warn(zone.name, channelsInZoneResult.value.reason);
                    return;
                }
                const zoneEmptyChannels = channelsInZoneResult.value.channels
                    .filter(channel => {
                    return !ChannelUtils_1.ChannelUtils.isChannelSpacer(channel.name) &&
                        ChannelUtils_1.ChannelUtils.countChannelTreeTotalClients(channel, channelList) === 0;
                }).map(channel => channel.cid);
                emptyChannelList.push({
                    zone: zone.name,
                    inactive: zoneEmptyChannels,
                    total: channelsInZoneResult.value.channels.length
                });
            });
            console.log('Empty channels list:', emptyChannelList.map(c => c.inactive));
            const results = await new ProcessResult_1.ProcessResult(emptyChannelList, this.config).processResults();
            const deletedChannels = await new ChannelCleanup_1.ChannelCleanup(this.bot, this.config.zones, results).cleanupChannels();
            this.raiseChannelEvents(results, deletedChannels);
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
    /**
     * Raise events for the processed results
     * @param result Crawl processing result
     */
    raiseChannelEvents(result, deletedChannels) {
        const botEvents = this.bot.getBotEvents();
        result.forEach(({ zone, toNotify, toDelete, activeNotifiedChannels }) => {
            const config = this.config.zones.find(conf => conf.name === zone);
            if (!config)
                return;
            toNotify.forEach(channel => botEvents.raiseChannelInactiveNotify(channel.channelId, config.name, config.inactiveIcon));
            activeNotifiedChannels.forEach(channel => botEvents.raiseChannelNotInactiveNotify(channel.channelId));
            // notify only with channels actually deleted from server
            toDelete
                .filter(toDel => deletedChannels.indexOf(toDel.channelId) >= 0)
                .forEach(channel => botEvents.raiseChannelInactiveDelete(channel.channelId, config.name));
        });
    }
}
exports.Crawler = Crawler;
//# sourceMappingURL=Crawler.js.map