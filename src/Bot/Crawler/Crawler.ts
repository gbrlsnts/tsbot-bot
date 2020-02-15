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

    /**
     * Boot the crawler
     */
    boot()
    {
        if(this.isBooted)
            return;

        this.startTimer();

        this.isBooted = true;
    }

    /**
     * Reload the crawler config
     * @param config the config to apply
     */
    reload(config: CrawlerConfiguration)
    {
        if(!this.isRunning) {
            this.config = config;

            return;
        }

        this.onCrawlEnd = () => this.config = config;
    }

    /**
     * Start the crawl timer
     */
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

    /**
     * Get the interval to run the crawl timer
     */
    private getTimerInterval()
    {
        if(this.isBooted)
            return this.config.interval * 1000;

        return this.bootTimer * 1000;
    }

    /**
     * Do a crawl
     */
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

    /**
     * Raise events for the processed results
     * @param result Crawl processing result
     */
    private raiseChannelEvents(result: ZoneProcessResult[])
    {
        const botEvents = this.bot.getBotEvents();

        result.forEach(({ zone, channels, activeNotifiedChannels }) => {
            const config = this.config.zones.find(conf => conf.name === zone);

            if(!config)
                return;

            channels
                .filter(channel => this.channelExceededNotifyTime(config, channel))
                .forEach(channel => botEvents.raiseChannelInactiveNotify(channel.channelId, config.name, config.inactiveIcon));

            channels
                .filter(channel => this.channelExceededMaxTime(config, channel))
                .forEach(channel => botEvents.raiseChannelInactiveDelete(channel.channelId, config.name));

            activeNotifiedChannels
                .forEach(channel => botEvents.raiseChannelNotInactiveNotify(channel.channelId));
        });
    }

    /**
     * Check if the channel has exceeded the notifytime
     * @param zone The channel zone
     * @param channel The channel
     */
    private channelExceededNotifyTime(zone: CrawlZone, channel: CrawlerChannel): boolean
    {
        return channel.timeEmpty >= zone.timeInactiveNotify && channel.timeEmpty < zone.timeInactiveMax;
    }

    /**
     * Check if the channel exceeded the max inactive time
     * @param zone The channel zone
     * @param channel The channel
     */
    private channelExceededMaxTime(zone: CrawlZone, channel: CrawlerChannel): boolean
    {
        return channel.timeEmpty >= zone.timeInactiveMax;
    }
}