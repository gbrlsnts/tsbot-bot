import { CrawlInfo, CrawlZoneInfo, CrawlerChannel, ZoneCrawlResult } from "./CrawlerTypes";

export class Crawl {
    
    constructor(readonly crawl: CrawlInfo, readonly channels: CrawlerChannel[])
    {

    }

    /**
     * Create a crawl with empty values and run date as the current time
     */
    static createNullCrawl(): Crawl
    {
        const nullCrawl = {
            runAt: new Date(),
            zones: []
        }

        return new Crawl(nullCrawl, []);
    }

    /**
     * Create a crawl from a new crawl result
     */
    static fromNewCrawl(crawlResult: ZoneCrawlResult[]): Crawl
    {
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
        const crawlerChannels: CrawlerChannel[] = channels.map(channel => ({
            channelId: channel,
            timeInactive: 0,
            isNotified: false,
            lastUpdated: new Date(),
        }));

        return new Crawl(crawl, crawlerChannels);
    }


}