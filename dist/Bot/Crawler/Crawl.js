"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Crawl {
    constructor(crawl, channels) {
        this.crawl = crawl;
        this.channels = channels;
    }
    /**
     * Create a crawl with empty values and run date as the current time
     */
    static createNullCrawl() {
        const nullCrawl = {
            runAt: new Date(),
            zones: []
        };
        return new Crawl(nullCrawl, []);
    }
    /**
     * Create a crawl from a new crawl result
     */
    static fromNewCrawl(crawlResult) {
        const zones = crawlResult.map(result => {
            return {
                zone: result.zone,
                inactiveChannels: result.inactive.length,
                totalChannels: result.total
            };
        });
        const crawl = {
            runAt: new Date(),
            zones,
        };
        const channels = Array.prototype.concat.apply([], crawlResult.map(zoneResult => zoneResult.inactive));
        const crawlerChannels = channels.map(channel => ({
            channelId: channel,
            timeInactive: 0,
            isNotified: false,
            lastUpdated: new Date(),
        }));
        return new Crawl(crawl, crawlerChannels);
    }
}
exports.Crawl = Crawl;
//# sourceMappingURL=Crawl.js.map