import { CrawlerChannel, ZoneCrawlResult, ZoneProcessResult } from "./CrawlerTypes";
import { RepositoryInterface } from "./Repository/RepositoryInterface";
import { Factory } from "./Repository/Factory";

export class ProcessResult
{
    private readonly repository: RepositoryInterface;

    constructor(private readonly result: ZoneCrawlResult[], private readonly crawlInterval: number)
    {
        this.repository = new Factory().create();
    }

    /**
     * Process crawling results
     */
    async processResults(): Promise<ZoneProcessResult[]>
    {
        const prevCrawl = await this.repository.getPreviousCrawl();
        const emptyChannelIds: number[] = Array.prototype.concat.apply([], this.result.map(zoneResult => zoneResult.empty));

        let prevCrawlChannels = await this.repository.getCrawlerEmptyChannels();
        let prevCrawlActiveNotifiedChannels: CrawlerChannel[] = [];

        if(prevCrawl) {
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

        // if for some reason the crawling hasnt ran for a while, reset the database so there aren't accidental deletions
        if(prevCrawl && this.shouldResetDatabase(prevCrawl.runAt)) {
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
    private getChannelsStillEmpty(previousCrawlChannels: CrawlerChannel[], currentCrawlIds: number[]): CrawlerChannel[]
    {
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
    private getChannelsActiveNotified(previousCrawlChannels: CrawlerChannel[], currentCrawlIds: number[]): CrawlerChannel[]
    {
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
    private getNewEmptyChannels(previousCrawlChannels: CrawlerChannel[], currentCrawlIds: number[]): CrawlerChannel[]
    {
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
    private getProcessingResult(inactiveList: CrawlerChannel[], activeNotifiedList: CrawlerChannel[]): ZoneProcessResult[]
    {
        return this.result.map(zone => {
            const channels = inactiveList.filter(channel => {
                return zone.empty.find(id => id === channel.channelId);
            });

            return {
                zone: zone.zone,
                activeNotifiedChannels: activeNotifiedList,
                channels,
            }
        });
    }

    /**
     * Check if the database should be reset. It returns true if the last crawl ran more than 5 crawls time ago
     * @param lastCrawl The run time of the last crawl
     */
    private shouldResetDatabase(lastCrawl: Date)
    {
        const diff = new Date().getTime() - lastCrawl.getTime();

        // if the difference is bigger than 5 crawls then reset
        return diff > this.crawlInterval * 5 * 1000;
    }
}