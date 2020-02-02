import { Bot } from "../Bot";
import { Repository } from "../../Repository/RepositoryInterface";
import { CrawlerConfiguration, CrawlZone } from "../Configuration/Configuration";
import { clearTimeout } from "timers";
import { TeamSpeakChannel } from "ts3-nodejs-library";
import { ChannelUtils } from "../Utils/ChannelUtils";
import { CrawlerChannel } from "../../Entities/Channel";

export class Crawler
{
    private readonly bootTimer: number = 30;

    private isBooted: boolean = false;
    private timer?: NodeJS.Timeout;

    constructor(private bot: Bot, private repository: Repository, private config: CrawlerConfiguration)
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
                emptyChannelList.push(...this.checkZoneChannels(zone, channelList));
            });

            console.log('Empty channels list:', emptyChannelList.map(c=>c.name));

            this.updateChannelsState(emptyChannelList);
        } catch(e) {
            console.log(`Crawl error: ${e.message}`);
        } finally {
            this.startTimer();
            console.log('crawl ended');
        }
    }

    private checkZoneChannels(zone: CrawlZone, allChannels: TeamSpeakChannel[]): TeamSpeakChannel[]
    {
        const channelsInZone = ChannelUtils.getTopChannelsBetween(
            allChannels,
            zone.start,
            zone.end
        );

        if(!channelsInZone.hasStart || !channelsInZone.hasEnd)
            throw new Error(`Unable to find start or end in zone ${zone.name}`);

        return channelsInZone.channels
            .filter(channel => !ChannelUtils.isChannelSpacer(channel.name))
            .filter(channel => {
                const subTotalClients = ChannelUtils
                    .getAllSubchannels(channel, allChannels)
                    .map(sub => sub.totalClients)
                    .reduce((accumulator, current) => accumulator + current);

                    return channel.totalClients + subTotalClients === 0;
            });
    }

    private updateChannelsState(channelList: TeamSpeakChannel[])
    {
        // get last crawl information

        // get channels in db 

        // add time between crawls to the empty times / initialize new empty channels

        // emit events for channels empty for too long

        // send empty channel list to repository
    }

    private emitDeleteChannelEvent()
    {
        // emit event to delete the channel
    }
}