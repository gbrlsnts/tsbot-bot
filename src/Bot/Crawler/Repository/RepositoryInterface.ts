import { CrawlerChannel, CrawlInfo } from "../CrawlerTypes";

export interface Repository {
    getPreviousCrawl(): Promise<CrawlInfo | undefined>;
    addPreviousCrawl(crawl: CrawlInfo): Promise<void>;

    getCrawlerEmptyChannels(): Promise<CrawlerChannel[]>;
    setCrawlerEmptyChannels(channelList: CrawlerChannel[]): Promise<void>;
}