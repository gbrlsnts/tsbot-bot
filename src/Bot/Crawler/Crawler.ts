import { Bot } from "../Bot";
import { Repository } from "./Repository/RepositoryInterface";
import { CrawlerConfiguration } from "../Configuration/Configuration";
import { clearTimeout } from "timers";
import { TeamSpeakChannel } from "ts3-nodejs-library";
import { ChannelUtils } from "../Utils/ChannelUtils";
import { CrawlerChannel } from "./CrawlerTypes";

export class Crawler
{
    private readonly bootTimer: number = 30;

    private isBooted: boolean = false;
    private timer?: NodeJS.Timeout;

    constructor(
        private bot: Bot,
        private repository: Repository,
        private config: CrawlerConfiguration
    )
    {

    }

    boot()
    {
        if(this.isBooted)
            return;

        this.startTimer();

        this.isBooted = true;
    }

    reload(config: CrawlerConfiguration)
    {
        // apply config and reload
    }

    private startTimer()
    {
        if(this.timer)
            clearTimeout(this.timer);

        const interval = this.getTimerInterval();

        this.timer = setTimeout(
            this.crawl.bind(this),
            interval
        );

        console.log(`Next crawl to run in ${interval/1000} seconds`);
    }

    private getTimerInterval()
    {
        if(this.isBooted)
            return this.config.interval * 1000;

        return this.bootTimer * 1000;
    }

    private async crawl()
    {
        console.log('starting crawl...');

        try {
            const channelList = await this.bot.getServer().channelList();
            const emptyChannelList: ZoneCrawlResult[] = [];

            this.config.zones.forEach(zone => {
                const channelsInZone = ChannelUtils.getTopChannelsBetween(channelList, zone.start, zone.end, !zone.spacerAsSeparator);

                if(!channelsInZone.hasStart || !channelsInZone.hasEnd)
                    throw new Error(`Unable to find start or end in zone ${zone.name}`);

                const zoneEmptyChannels = channelsInZone.channels.filter(channel => {
                    return !ChannelUtils.isChannelSpacer(channel.name) &&
                        ChannelUtils.countChannelTreeTotalClients(channel, channelList) === 0;
                }).map(channel => channel.cid);

                emptyChannelList.push({
                    zone: zone.name,
                    empty: zoneEmptyChannels,
                    total: channelsInZone.channels.length
                });
            });

            console.log('Empty channels list:', emptyChannelList.map(c=>c.empty));

            await this.updateChannelsState(emptyChannelList);
        } catch(e) {
            console.log(`Crawl error: ${e.message}`);
        } finally {
            this.startTimer();
            console.log('crawl ended');
        }
    }

    private async updateChannelsState(emptyChannelList: ZoneCrawlResult[])
    {
        const prevCrawl = await this.repository.getPreviousCrawl();
        const emptyChannelIds: number[] = Array.prototype.concat.apply([], emptyChannelList.map(zoneResult => zoneResult.empty));
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
            zones: emptyChannelList.map(zoneResult => {
                return {
                    zone: zoneResult.zone,
                    emptyChannels: zoneResult.empty.length,
                    totalChannels: zoneResult.total
                };
            }),
        });

        await this.repository.setCrawlerEmptyChannels(finalEmptyChannelList);
        await this.verifyChannelsToDelete(finalEmptyChannelList);
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

    private async verifyChannelsToDelete(empyChannelList: CrawlerChannel[])
    {
        // for each zone, check which exceed the time limit
        // delete or emit event for those that exceeded
    }
}

interface ZoneCrawlResult {
    /** the crawled zone */
    zone: string;
    /** empty channels id's */
    empty: number[];
    /** total number of channels, including non-empty */
    total: number;
}