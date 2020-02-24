"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Crawl {
    constructor(crawl, inactive, active = []) {
        this.crawl = crawl;
        this.inactive = inactive;
        this.active = active;
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
        const activeChannels = Array.prototype.concat.apply([], crawlResult.map(zoneResult => zoneResult.active));
        const inactiveChannels = Array.prototype.concat.apply([], crawlResult.map(zoneResult => zoneResult.inactive));
        const inactiveCrawlerChannels = inactiveChannels.map(channel => ({
            channelId: channel,
            timeInactive: 0,
            isNotified: false,
            lastUpdated: new Date(),
        }));
        return new Crawl(crawl, inactiveCrawlerChannels, activeChannels);
    }
}
exports.Crawl = Crawl;
//# sourceMappingURL=Crawl.js.map