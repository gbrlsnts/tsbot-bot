import { CrawlerChannel, ZoneCrawlResult } from "./CrawlerTypes";
import { RepositoryInterface } from "./Repository/RepositoryInterface";
import { Factory } from "./Repository/Factory";

export class ProcessResult
{
    private readonly repository: RepositoryInterface;

    constructor(private readonly result: ZoneCrawlResult[])
    {
        this.repository = new Factory().create();
    }

    async processResults(): Promise<CrawlerChannel[]>
    {
        const prevCrawl = await this.repository.getPreviousCrawl();
        const emptyChannelIds: number[] = Array.prototype.concat.apply([], this.result.map(zoneResult => zoneResult.empty));

        let prevCrawlChannels = await this.repository.getCrawlerEmptyChannels();

        if(prevCrawl) {
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

        return finalEmptyChannelList;
    }

    private getChannelsStillEmpty(previousCrawlChannels: CrawlerChannel[], currentCrawlIds: number[]): CrawlerChannel[]
    {
        // filter out channels no longer in the empty list
        return previousCrawlChannels.filter(prev => {
            return currentCrawlIds.find(id => id == prev.channelId);
        });
    }

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
                    lastUpdated: new Date()
                };
            });
    }
}