import {
    CrawlerChannel,
    ZoneCrawlResult,
    ZoneProcessResult,
} from './CrawlerTypes';
import { RepositoryInterface } from '../Repository/RepositoryInterface';
import {
    CrawlZone,
    CrawlerConfiguration,
} from '../Configuration/Configuration';
import { Crawl } from './Crawl';
import { CrawlCompare } from './CrawlCompare';

export class ProcessResult {
    constructor(
        readonly serverId: number | string,
        private readonly result: ZoneCrawlResult[],
        private readonly config: CrawlerConfiguration,
        private readonly repository: RepositoryInterface
    ) {}

    /**
     * Process crawling results
     */
    async processResults(): Promise<ZoneProcessResult[]> {
        const [repoPrevCrawll, repoPrevChannels] = await Promise.all([
            this.repository.getPreviousCrawl(this.serverId),
            this.repository.getCrawlerInactiveChannels(this.serverId),
        ]);

        const prevCrawl =
            repoPrevCrawll && repoPrevChannels
                ? new Crawl(repoPrevCrawll, repoPrevChannels)
                : Crawl.createNullCrawl();
        const currCrawl = Crawl.fromNewCrawl(this.result);
        const crawlCompare = new CrawlCompare(prevCrawl, currCrawl);

        const secondsFromPrevCrawl = Math.round(
            (new Date().getTime() - prevCrawl.crawl.runAt.getTime()) / 1000
        );
        const inactiveChannels = crawlCompare.getInactiveChannelsWithAddedTime(
            secondsFromPrevCrawl
        );

        // if for some reason the crawling hasnt ran for a while, reset the database so there aren't accidental deletions
        if (this.shouldResetDatabase(prevCrawl.crawl.runAt)) {
            inactiveChannels.forEach(channel => (channel.timeInactive = 0));
        }

        const result = this.getProcessingResult(
            inactiveChannels,
            crawlCompare.getBackToActive()
        );
        result.forEach(zone =>
            currCrawl.setDeletedChannels(zone.zone, zone.toDelete.length)
        );

        await Promise.all([
            this.repository.addCrawl(this.serverId, currCrawl.crawl),
            this.repository.setCrawlerInactiveChannels(
                this.serverId,
                inactiveChannels
            ),
        ]);

        return result;
    }

    /**
     * Get the processed results of a crawl
     * @param inactiveList List of inactive channels
     * @param activeNotifiedChannels List of active and notified channels
     */
    private getProcessingResult(
        inactiveList: CrawlerChannel[],
        activeNotifiedChannels: CrawlerChannel[]
    ): ZoneProcessResult[] {
        return this.result.map(zone => {
            const channels = inactiveList.filter(channel => {
                return zone.inactive.find(id => id === channel.channelId);
            });

            const config = this.config.zones.find(
                conf => conf.name === zone.zone
            );

            let toNotify: CrawlerChannel[] = [],
                toDelete: CrawlerChannel[] = [];

            if (config) {
                toNotify = channels.filter(channel =>
                    this.channelExceededNotifyTime(config, channel)
                );
                toDelete = channels.filter(channel =>
                    this.channelExceededMaxTime(config, channel)
                );
            }

            return {
                zone: zone.zone,
                activeNotifiedChannels,
                channels,
                toNotify,
                toDelete,
            };
        });
    }

    /**
     * Check if the database should be reset. It returns true if the last crawl ran more than 5 crawls time ago
     * @param lastCrawl The run time of the last crawl
     */
    private shouldResetDatabase(lastCrawl: Date) {
        const diff = new Date().getTime() - lastCrawl.getTime();

        // if the difference is bigger than 5 crawls then reset
        return diff > this.config.interval * 5 * 1000;
    }

    /**
     * Check if the channel has exceeded the notifytime
     * @param zone The channel zone
     * @param channel The channel
     */
    private channelExceededNotifyTime(
        zone: CrawlZone,
        channel: CrawlerChannel
    ): boolean {
        return (
            channel.timeInactive >= zone.timeInactiveNotify &&
            channel.timeInactive < zone.timeInactiveMax
        );
    }

    /**
     * Check if the channel exceeded the max inactive time
     * @param zone The channel zone
     * @param channel The channel
     */
    private channelExceededMaxTime(
        zone: CrawlZone,
        channel: CrawlerChannel
    ): boolean {
        return channel.timeInactive >= zone.timeInactiveMax;
    }
}
