"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Factory_1 = require("./Repository/Factory");
class ProcessResult {
    constructor(result, crawlInterval) {
        this.result = result;
        this.crawlInterval = crawlInterval;
        this.repository = new Factory_1.Factory().create();
    }
    /**
     * Process crawling results
     */
    async processResults() {
        const prevCrawl = await this.repository.getPreviousCrawl();
        const emptyChannelIds = Array.prototype.concat.apply([], this.result.map(zoneResult => zoneResult.empty));
        let prevCrawlChannels = await this.repository.getCrawlerEmptyChannels();
        let prevCrawlActiveNotifiedChannels = [];
        if (prevCrawl) {
            const secondsFromPrevCrawl = Math.round((new Date().getTime() - prevCrawl.runAt.getTime()) / 1000);
            // get channels now active again
            prevCrawlActiveNotifiedChannels = this.getChannelsActiveNotified(prevCrawlChannels, emptyChannelIds);
            // filter out channels no longer in the empty list and then add empty time
            prevCrawlChannels = this.getChannelsStillEmpty(prevCrawlChannels, emptyChannelIds);
            prevCrawlChannels.forEach(channel => {
                channel.timeEmpty += secondsFromPrevCrawl;
                channel.lastUpdated = new Date();
            });
        }
        const newEmptyChannels = this.getNewEmptyChannels(prevCrawlChannels, emptyChannelIds);
        const finalEmptyChannelList = [...prevCrawlChannels, ...newEmptyChannels];
        await this.repository.addCrawl({
            runAt: new Date(),
            zones: this.result.map(zoneResult => {
                return {
                    zone: zoneResult.zone,
                    emptyChannels: zoneResult.empty.length,
                    totalChannels: zoneResult.total
                };
            }),
        });
        // if for some reason the crawling hasnt ran for a while, reset the database so there aren't accidental deletions
        if (prevCrawl && this.shouldResetDatabase(prevCrawl.runAt)) {
            finalEmptyChannelList.forEach(channel => channel.timeEmpty = 0);
        }
        await this.repository.setCrawlerEmptyChannels(finalEmptyChannelList);
        return this.getProcessingResult(finalEmptyChannelList, prevCrawlActiveNotifiedChannels);
    }
    /**
     * Get channels that are still empty from a previous crawl
     * @param previousCrawlChannels Channels of the previous crawl
     * @param currentCrawlIds Channel Ids on the current crawl
     */
    getChannelsStillEmpty(previousCrawlChannels, currentCrawlIds) {
        // filter out channels no longer in the empty list
        return previousCrawlChannels.filter(prev => {
            return currentCrawlIds.find(id => id === prev.channelId);
        });
    }
    /**
     * Get channels that are now active and were notified previously
     * @param previousCrawlChannels Channels of the previous crawl
     * @param currentCrawlIds Channel Ids on the current crawl
     */
    getChannelsActiveNotified(previousCrawlChannels, currentCrawlIds) {
        // filter channels no longer empty
        return previousCrawlChannels.filter(prev => {
            return prev.isNotified && currentCrawlIds.every(id => id !== prev.channelId);
        });
    }
    /**
     * Get new channels that are empty
     * @param previousCrawlChannels Channels of the previous crawl
     * @param currentCrawlIds Channel Ids on the current crawl
     */
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
                isNotified: false,
                lastUpdated: new Date()
            };
        });
    }
    /**
     * Get the processed results of a crawl
     * @param inactiveList List of inactive channels
     * @param activeNotifiedList List of active and notified channels
     */
    getProcessingResult(inactiveList, activeNotifiedList) {
        return this.result.map(zone => {
            const channels = inactiveList.filter(channel => {
                return zone.empty.find(id => id === channel.channelId);
            });
            return {
                zone: zone.zone,
                activeNotifiedChannels: activeNotifiedList,
                channels,
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
        return diff > this.crawlInterval * 5 * 1000;
    }
}
exports.ProcessResult = ProcessResult;
//# sourceMappingURL=ProcessResult.js.map