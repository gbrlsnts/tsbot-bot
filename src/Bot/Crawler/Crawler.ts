import { Bot } from "../Bot";
import { CrawlerConfiguration, CrawlZone } from "../Configuration/Configuration";
import { clearTimeout } from "timers";
import { ChannelUtils } from "../Utils/ChannelUtils";
import { ZoneCrawlResult, CrawlerChannel, ZoneProcessResult } from "./CrawlerTypes";
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
                const channelsInZoneResult = ChannelUtils.getZoneTopChannels(channelList, zone.start, zone.end, !zone.spacerAsSeparator);

                if(channelsInZoneResult.isLeft()) {
                    console.warn(zone.name, channelsInZoneResult.value.reason);
                    return;
                }

                const zoneEmptyChannels = channelsInZoneResult.value.channels
                    .filter(channel => {
                        return !ChannelUtils.isChannelSpacer(channel.name) &&
                            ChannelUtils.countChannelTreeTotalClients(channel, channelList) === 0;
                    }).map(channel => channel.cid);

                emptyChannelList.push({
                    zone: zone.name,
                    empty: zoneEmptyChannels,
                    total: channelsInZoneResult.value.channels.length
                });
            });

            console.log('Empty channels list:', emptyChannelList.map(c=>c.empty));

            const processResult = new ProcessResult(emptyChannelList, this.config.interval);
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

    private raiseChannelEvents(result: ZoneProcessResult[])
    {
        const botEvents = this.bot.getBotEvents();

        result.forEach(({ zone, channels }) => {
            const config = this.config.zones.find(conf => conf.name === zone);

            if(!config)
                return;

            channels
                .filter(channel => this.channelExceededNotifyTime(config, channel))
                .forEach(channel => botEvents.raiseChannelInactiveNotify(channel.channelId, config.name, config.inactiveIcon));

            channels
                .filter(channel => this.channelExceededMaxTime(config, channel))
                .forEach(channel => botEvents.raiseChannelInactiveDelete(channel.channelId, config.name));
        });
    }

    private channelExceededNotifyTime(zone: CrawlZone, channel: CrawlerChannel): boolean
    {
        return channel.timeEmpty >= zone.timeInactiveNotify && channel.timeEmpty < zone.timeInactiveMax;
    }

    private channelExceededMaxTime(zone: CrawlZone, channel: CrawlerChannel): boolean
    {
        return channel.timeEmpty >= zone.timeInactiveMax;
    }
}