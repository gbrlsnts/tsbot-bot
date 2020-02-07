"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Factory_1 = require("./Repository/Factory");
class ProcessResult {
    constructor(result) {
        this.result = result;
        this.repository = new Factory_1.Factory().create();
    }
    async processResults() {
        const prevCrawl = await this.repository.getPreviousCrawl();
        const emptyChannelIds = Array.prototype.concat.apply([], this.result.map(zoneResult => zoneResult.empty));
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
            zones: this.result.map(zoneResult => {
                return {
                    zone: zoneResult.zone,
                    emptyChannels: zoneResult.empty.length,
                    totalChannels: zoneResult.total
                };
            }),
        });
        await this.repository.setCrawlerEmptyChannels(finalEmptyChannelList);
        return this.getProcessingResult(finalEmptyChannelList);
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
    getProcessingResult(channelList) {
        return this.result.map(zone => {
            const channels = channelList.filter(channel => {
                return zone.empty.find(id => id === channel.channelId);
            });
            return {
                zone: zone.zone,
                channels
            };
        });
    }
}
exports.ProcessResult = ProcessResult;
//# sourceMappingURL=ProcessResult.js.map