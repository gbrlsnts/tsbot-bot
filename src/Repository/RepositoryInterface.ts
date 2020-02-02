import { CrawlerChannel } from "../Entities/Channel";

export interface Repository {
    getCrawlerEmptyChannels(): CrawlerChannel[];
    setCrawlerEmptyChannels(channelList: CrawlerChannel[]): void;
}