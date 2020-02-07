import { Bot } from "../Bot";
import { CrawlerConfiguration } from "../Configuration/Configuration";
import { clearTimeout } from "timers";
import { ChannelUtils } from "../Utils/ChannelUtils";
import { ZoneCrawlResult, CrawlerChannel } from "./CrawlerTypes";
import { ProcessResult } from "./ProcessResult";

export class Crawler
{
    private readonly bootTimer: number = 30;

    private isBooted: boolean = false;
    private isRunning: boolean = false;

    private timer?: NodeJS.Timeout;

    private onCrawlEnd?: CallableFunction;

    constructor(
        private bot: Bot,
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
        if(!this.isRunning) {
            this.config = config;

            return;
        }

        this.onCrawlEnd = () => this.config = config;
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
        this.isRunning = true;

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

            const processResult = new ProcessResult(emptyChannelList);
            const results = await processResult.processResults();

            this.raiseChannelEvents(results);
        } catch(e) {
            console.log(`Crawl error: ${e.message}`);
        } finally {
            this.startTimer();
            console.log('crawl ended');
            this.isRunning = false;

            if(this.onCrawlEnd) {
                this.onCrawlEnd();
                this.onCrawlEnd = undefined;
            }
        }
    }

    private raiseChannelEvents(emptyChannelList: CrawlerChannel[])
    {
        // raise notify or delete events depending on zone config...
        const botEvents = this.bot.getBotEvents();

        emptyChannelList.forEach(channel => botEvents.raiseChannelInactiveNotify(channel.channelId));
    }
}