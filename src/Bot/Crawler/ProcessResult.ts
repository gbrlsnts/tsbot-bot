import { CrawlerChannel, ZoneCrawlResult, ZoneProcessResult } from "./CrawlerTypes";
import { RepositoryInterface } from "./Repository/RepositoryInterface";
import { Factory } from "./Repository/Factory";
import { Z_NO_COMPRESSION } from "zlib";

export class ProcessResult
{
    private readonly repository: RepositoryInterface;

    constructor(private readonly result: ZoneCrawlResult[])
    {
        this.repository = new Factory().create();
    }

    async processResults(): Promise<ZoneProcessResult[]>
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

        return this.getProcessingResult(finalEmptyChannelList);
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

    private getProcessingResult(channelList: CrawlerChannel[]): ZoneProcessResult[]
    {
        return this.result.map(zone => {
            const channels = channelList.filter(channel => {
                return zone.empty.find(id => id === channel.channelId);
            });

            return {
                zone: zone.zone,
                channels
            }
        });
    }
}