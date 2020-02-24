import { CrawlInfo, CrawlZoneInfo, CrawlerChannel, ZoneCrawlResult } from "./CrawlerTypes";

export class Crawl {
    
    constructor(readonly crawl: CrawlInfo, readonly inactive: CrawlerChannel[], readonly active: number[] = [])
    {

    }

    /**
     * Set the number of deleted channels in a zone
     * @param zone The zone to set the count
     * @param count The number of deleted channels
     */
    setDeletedChannels(zone:string, count: number)
    {
        const crawlZone = this.crawl.zones.find(z => z.zone === zone);

        if(crawlZone)
            crawlZone.deletedChannels = count;
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
                deletedChannels: 0, // unknown yet
                totalChannels: result.total
            };
        });

        const crawl = {
            runAt: new Date(),
            zones,
        };

        const activeChannels = Array.prototype.concat.apply([], crawlResult.map(zoneResult => zoneResult.active));
        const inactiveChannels = Array.prototype.concat.apply([], crawlResult.map(zoneResult => zoneResult.inactive));

        const inactiveCrawlerChannels: CrawlerChannel[] = inactiveChannels.map(channel => ({
            channelId: channel,
            timeInactive: 0,
            isNotified: false,
            lastUpdated: new Date(),
        }));

        return new Crawl(crawl, inactiveCrawlerChannels, activeChannels);
    }


}