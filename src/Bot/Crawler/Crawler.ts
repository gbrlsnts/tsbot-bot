import { Bot } from '../Bot';
import { CrawlerConfiguration } from '../Configuration/Configuration';
import { clearTimeout } from 'timers';
import { ChannelUtils } from '../Utils/ChannelUtils';
import { ZoneCrawlResult, ZoneProcessResult } from './CrawlerTypes';
import { ProcessResult } from './ProcessResult';
import { ChannelCleanup } from './ChannelCleanup';
import Logger from '../../Log/Logger';
import { RepositoryInterface } from '../Repository/RepositoryInterface';

export class Crawler {
    private readonly bootTimer: number = 30;

    private isBooted: boolean = false;
    private isRunning: boolean = false;

    private timer?: NodeJS.Timeout;

    private onCrawlEnd?: CallableFunction;

    constructor(
        private readonly bot: Bot,
        private readonly logger: Logger,
        private readonly repository: RepositoryInterface,
        private config: CrawlerConfiguration
    ) {}

    /**
     * Boot the crawler
     */
    boot() {
        if (this.isBooted) return;

        this.startTimer();

        this.isBooted = true;
    }

    /**
     * Stop the crawler
     */
    stop() {
        this.onCrawlEnd = () => {
            if (this.timer) clearTimeout(this.timer);
        };

        if (!this.isRunning) {
            this.onCrawlEnd();

            return;
        }
    }

    /**
     * Reload the crawler config
     * @param config the config to apply
     */
    reload(config: CrawlerConfiguration) {
        if (!this.isRunning) {
            this.config = config;

            return;
        }

        this.onCrawlEnd = () => (this.config = config);
    }

    /**
     * Start the crawl timer
     */
    private startTimer() {
        if (this.timer) clearTimeout(this.timer);

        const interval = this.getTimerInterval();

        this.timer = setTimeout(this.crawl.bind(this), interval);

        this.logger.debug(`Next crawl to run in ${interval / 1000} seconds`);
    }

    /**
     * Get the interval to run the crawl timer
     */
    private getTimerInterval() {
        if (this.isBooted) return this.config.interval * 1000;

        return this.bootTimer * 1000;
    }

    /**
     * Do a crawl
     */
    private async crawl() {
        this.logger.debug('Starting crawl');
        this.isRunning = true;

        try {
            if (!this.bot.isConnected)
                throw new Error('Bot not connected to server');

            const channelList = await this.bot.getServer().channelList();
            const crawlResults: ZoneCrawlResult[] = [];

            this.config.zones.forEach(zone => {
                const channelsInZoneResult = ChannelUtils.getZoneTopChannels(
                    channelList,
                    zone.start,
                    zone.end,
                    !zone.spacerAsSeparator
                );

                if (channelsInZoneResult.isLeft()) {
                    this.logger.warn(channelsInZoneResult.value.reason, {
                        context: {
                            zone: zone.name,
                        },
                        canShare: true,
                    });

                    return;
                }

                const zoneInactiveChannels: number[] = [],
                    zoneActiveChannels: number[] = [];

                channelsInZoneResult.value.channels.forEach(channel => {
                    if (ChannelUtils.isChannelSeparator(channel, channelList))
                        return;

                    if (
                        ChannelUtils.countChannelTreeTotalClients(
                            channel,
                            channelList
                        ) === 0
                    )
                        zoneInactiveChannels.push(channel.cid);
                    else zoneActiveChannels.push(channel.cid);
                });

                crawlResults.push({
                    zone: zone.name,
                    inactive: zoneInactiveChannels,
                    active: zoneActiveChannels,
                    total: channelsInZoneResult.value.channels.length,
                });
            });

            this.logger.debug('Got inactive channels list', {
                context: crawlResults.map(c => c.inactive),
            });

            const results = await new ProcessResult(
                this.bot.serverId,
                crawlResults,
                this.config,
                this.repository
            ).processResults();

            const deletedChannels = await new ChannelCleanup(
                this.bot,
                this.config.zones,
                results
            ).cleanupChannels();

            this.raiseChannelEvents(results, deletedChannels);
        } catch (e) {
            this.logger.error('Crawl error', { error: e });
        } finally {
            this.startTimer();
            this.logger.debug('Crawl ended');
            this.isRunning = false;

            if (this.onCrawlEnd) {
                this.onCrawlEnd();
                this.onCrawlEnd = undefined;
            }
        }
    }

    /**
     * Raise events for the processed results
     * @param result Crawl processing result
     */
    private raiseChannelEvents(
        result: ZoneProcessResult[],
        deletedChannels: number[]
    ) {
        const botEvents = this.bot.getBotEvents();

        result.forEach(
            ({ zone, toNotify, toDelete, activeNotifiedChannels }) => {
                const config = this.config.zones.find(
                    conf => conf.name === zone
                );

                if (!config) return;

                toNotify.forEach(channel =>
                    botEvents.raiseChannelInactiveNotify(
                        channel.channelId,
                        config.name,
                        config.inactiveIcon
                    )
                );
                activeNotifiedChannels.forEach(channel =>
                    botEvents.raiseChannelNotInactiveNotify(channel.channelId)
                );

                // notify only with channels actually deleted from server
                toDelete
                    .filter(
                        toDel => deletedChannels.indexOf(toDel.channelId) >= 0
                    )
                    .forEach(channel =>
                        botEvents.raiseChannelInactiveDelete(
                            channel.channelId,
                            config.name
                        )
                    );
            }
        );
    }
}
