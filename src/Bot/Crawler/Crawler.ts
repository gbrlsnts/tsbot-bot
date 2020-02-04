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
            const emptyChannelList: TeamSpeakChannel[] = [];

            this.config.zones.forEach(zone => {
                const channelsInZone = ChannelUtils.getTopChannelsBetween(channelList, zone.start, zone.end);

                if(!channelsInZone.hasStart || !channelsInZone.hasEnd)
                    throw new Error(`Unable to find start or end in zone ${zone.name}`);

                const zoneEmptyChannels = channelsInZone.channels.filter(channel => {
                    return !ChannelUtils.isChannelSpacer(channel.name) &&
                        ChannelUtils.countChannelTreeTotalClients(channel, channelList) === 0;
                });

                emptyChannelList.push(...zoneEmptyChannels);
            });

            console.log('Empty channels list:', emptyChannelList.map(c=>c.name));

            await this.updateChannelsState(emptyChannelList);
        } catch(e) {
            console.log(`Crawl error: ${e.message}`);
        } finally {
            this.startTimer();
            console.log('crawl ended');
        }
    }

    private async updateChannelsState(emptyChannelList: TeamSpeakChannel[])
    {
        const prevCrawl = await this.repository.getPreviousCrawl();
        const prevCrawlChannels = await this.repository.getCrawlerEmptyChannels();

        if(prevCrawl) {
            const secondsFromPrevCrawl = (new Date().getMilliseconds() - prevCrawl.runAt.getMilliseconds()) / 1000;

            // filter out channels no longer in the empty list and then add empty time
            prevCrawlChannels.filter(prevChannel => {
                    return emptyChannelList.find(c => c.cid == prevChannel.channelId) !== undefined;
                })
                .forEach(channel => channel.timeEmpty += secondsFromPrevCrawl);    
        }

        // filter out channels in previous crawls and initialize empty time
        const newEmptyChannels: CrawlerChannel[] = emptyChannelList.filter(emptyChannel => {
                return prevCrawlChannels.find(c => c.channelId == emptyChannel.cid) === undefined;
            })
            .map(channel => {
                return {
                    channelId: channel.cid,
                    timeEmpty: 0,
                    lastUpdated: new Date()
                };
            });

        const finalEmptyChannelList = [...prevCrawlChannels, ...newEmptyChannels];

        await this.repository.setCrawlerEmptyChannels(finalEmptyChannelList);
        await this.verifyChannelsToDelete(finalEmptyChannelList);
    }

    private verifyChannelsToDelete(empyChannelList: CrawlerChannel[])
    {
        // for each zone, check which exceed the time limit
        // delete or emit event for those that exceeded
    }
}