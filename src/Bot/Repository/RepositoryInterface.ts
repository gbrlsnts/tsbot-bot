import { CrawlerChannel, CrawlInfo } from '../Crawler/CrawlerTypes';

export interface RepositoryInterface {
    /**
     * Get all crawls
     * @param serverId
     */
    getCrawls(serverId: number | string): Promise<CrawlInfo[]>;

    /**
     * Get the previous crawl
     * @param serverId
     */
    getPreviousCrawl(serverId: number | string): Promise<CrawlInfo | undefined>;

    /**
     * Add a crawl
     * @param serverId
     * @param crawl The crawl info to add
     */
    addCrawl(serverId: number | string, crawl: CrawlInfo): Promise<void>;

    /**
     * Get all inactive channels
     * @param serverId
     */
    getCrawlerInactiveChannels(
        serverId: number | string
    ): Promise<CrawlerChannel[]>;

    /**
     * Save all channels of a crawl
     * @param serverId
     * @param channelList The channel list to save
     */
    setCrawlerInactiveChannels(
        serverId: number | string,
        channelList: CrawlerChannel[]
    ): Promise<void>;

    /**
     * Get an inactive channel by Id
     * @param serverId
     * @param channelId The channel Id
     */
    getChannelById(
        serverId: number | string,
        channelId: number
    ): Promise<CrawlerChannel>;

    /**
     * Set a channel notified value
     * @param serverId
     * @param channelId The channel Id to set
     * @param notified The notified value
     */
    setChannelNotified(
        serverId: number | string,
        channelId: number,
        notified: boolean
    ): Promise<void>;
}
