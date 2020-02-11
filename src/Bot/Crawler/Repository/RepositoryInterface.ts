import { CrawlerChannel, CrawlInfo } from "../CrawlerTypes";

export interface RepositoryInterface {
    getCrawls(): Promise<CrawlInfo[]>;
    getPreviousCrawl(): Promise<CrawlInfo | undefined>;
    addPreviousCrawl(crawl: CrawlInfo): Promise<void>;

    getCrawlerEmptyChannels(): Promise<CrawlerChannel[]>;
    setCrawlerEmptyChannels(channelList: CrawlerChannel[]): Promise<void>;

    getChannelById(channelId: number): Promise<CrawlerChannel>;
    setChannelNotified(channelId: number, notified: boolean): Promise<void>;
}