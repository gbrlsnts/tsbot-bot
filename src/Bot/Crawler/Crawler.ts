import { Bot } from "../Bot";
import { Database } from "../../Database/DatabaseInterface";
import { CrawlerConfiguration, CrawlZone } from "../Configuration/Configuration";
import { clearTimeout } from "timers";
import { TeamSpeakChannel } from "ts3-nodejs-library";
import { ChannelUtils } from "../Utils/ChannelUtils";

export class Crawler
{
    private readonly bootTimer: number = 30;

    private isBooted: boolean = false;
    private isRunning: boolean = false;

    private timer?: NodeJS.Timeout;

    constructor(private bot: Bot, private database: Database, private config: CrawlerConfiguration)
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

        this.timer = setTimeout(
            () => this.crawl.bind(this),
            this.getTimerInterval()
        );
    }

    private getTimerInterval()
    {
        if(this.isBooted)
            return this.config.interval * 1000;

        return this.bootTimer * 1000;
    }

    private async crawl()
    {
        this.isRunning = true;

        // fetch channel list, check time empty on channels per zone

        const channels = await this.bot.getServer().channelList();

        this.config.zones.forEach(z => this.checkZoneChannels(z, channels));

        await Promise.all(this.config.zones.map(z => this.checkZoneChannels(z, channels)))
            .catch(e => { throw e });

        // grab all channels and trigger database update

        this.isRunning = false;
        this.startTimer();
    }

    private async checkZoneChannels(zone: CrawlZone, allChannels: TeamSpeakChannel[])
    {
        const channelsInZone = ChannelUtils.getTopChannelsBetween(
            allChannels,
            zone.start,
            zone.end
        );

        if(!channelsInZone.hasStart || !channelsInZone.hasEnd)
            throw new Error(`Unable to find start or end in zone ${zone.name}`);

        channelsInZone.channels.forEach(channel => {
            // need to check if tree has any client online
        });

        // return a list of channels with not empty or empty status
    }

    private updateState()
    {
        // update channels state in the database, cleanup if necessary
    }

    private emitDeleteChannelEvent()
    {
        // emit event to delete the channel
    }
}