import { CrawlerChannel, CrawlInfo } from "../CrawlerTypes";

export interface RepositoryInterface {
    /**
     * Get all crawls
     */
    getCrawls(): Promise<CrawlInfo[]>;

    /**
     * Get the previous crawl
     */
    getPreviousCrawl(): Promise<CrawlInfo | undefined>;

    /**
     * Add a crawl
     * @param crawl The crawl info to add
     */
    addCrawl(crawl: CrawlInfo): Promise<void>;

    /**
     * Get all inactive channels
     */
    getCrawlerInactiveChannels(): Promise<CrawlerChannel[]>;

    /**
     * Save all channels of a crawl
     * @param channelList The channel list to save
     */
    setCrawlerInactiveChannels(channelList: CrawlerChannel[]): Promise<void>;

    /**
     * Get an inactive channel by Id
     * @param channelId The channel Id
     */
    getChannelById(channelId: number): Promise<CrawlerChannel>;

    /**
     * Set a channel notified value
     * @param channelId The channel Id to set
     * @param notified The notified value
     */
    setChannelNotified(channelId: number, notified: boolean): Promise<void>;
}