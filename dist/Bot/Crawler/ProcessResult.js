"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Factory_1 = require("./Repository/Factory");
const Crawl_1 = require("./Crawl");
const CrawlCompare_1 = require("./CrawlCompare");
class ProcessResult {
    constructor(result, config) {
        this.result = result;
        this.config = config;
        this.repository = new Factory_1.Factory().create();
    }
    /**
     * Process crawling results
     */
    async processResults() {
        const [repoPrevCrawll, repoPrevChannels] = await Promise.all([
            this.repository.getPreviousCrawl(),
            this.repository.getCrawlerInactiveChannels(),
        ]);
        const prevCrawl = repoPrevCrawll && repoPrevChannels ? new Crawl_1.Crawl(repoPrevCrawll, repoPrevChannels) : Crawl_1.Crawl.createNullCrawl();
        const currCrawl = Crawl_1.Crawl.fromNewCrawl(this.result);
        const crawlCompare = new CrawlCompare_1.CrawlCompare(prevCrawl, currCrawl);
        const secondsFromPrevCrawl = Math.round((new Date().getTime() - prevCrawl.crawl.runAt.getTime()) / 1000);
        const inactiveChannels = crawlCompare.getInactiveChannelsWithAddedTime(secondsFromPrevCrawl);
        // if for some reason the crawling hasnt ran for a while, reset the database so there aren't accidental deletions
        if (this.shouldResetDatabase(prevCrawl.crawl.runAt)) {
            inactiveChannels.forEach(channel => channel.timeInactive = 0);
        }
        const result = this.getProcessingResult(inactiveChannels, crawlCompare.getBackToActive());
        result.forEach(zone => currCrawl.setDeletedChannels(zone.zone, zone.toDelete.length));
        await Promise.all([
            this.repository.addCrawl(currCrawl.crawl),
            this.repository.setCrawlerInactiveChannels(inactiveChannels),
        ]);
        return result;
    }
    /**
     * Get the processed results of a crawl
     * @param inactiveList List of inactive channels
     * @param activeNotifiedChannels List of active and notified channels
     */
    getProcessingResult(inactiveList, activeNotifiedChannels) {
        return this.result.map(zone => {
            const channels = inactiveList.filter(channel => {
                return zone.inactive.find(id => id === channel.channelId);
            });
            const config = this.config.zones.find(conf => conf.name === zone.zone);
            let toNotify = [], toDelete = [];
            if (config) {
                toNotify = channels.filter(channel => this.channelExceededNotifyTime(config, channel));
                toDelete = channels.filter(channel => this.channelExceededMaxTime(config, channel));
            }
            return {
                zone: zone.zone,
                activeNotifiedChannels,
                channels,
                toNotify,
                toDelete,
            };
        });
    }
    /**
     * Check if the database should be reset. It returns true if the last crawl ran more than 5 crawls time ago
     * @param lastCrawl The run time of the last crawl
     */
    shouldResetDatabase(lastCrawl) {
        const diff = new Date().getTime() - lastCrawl.getTime();
        // if the difference is bigger than 5 crawls then reset
        return diff > this.config.interval * 5 * 1000;
    }
    /**
     * Check if the channel has exceeded the notifytime
     * @param zone The channel zone
     * @param channel The channel
     */
    channelExceededNotifyTime(zone, channel) {
        return channel.timeInactive >= zone.timeInactiveNotify && channel.timeInactive < zone.timeInactiveMax;
    }
    /**
     * Check if the channel exceeded the max inactive time
     * @param zone The channel zone
     * @param channel The channel
     */
    channelExceededMaxTime(zone, channel) {
        return channel.timeInactive >= zone.timeInactiveMax;
    }
}
exports.ProcessResult = ProcessResult;
//# sourceMappingURL=ProcessResult.js.map