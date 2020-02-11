import { join as pathJoin } from 'path';
import { RepositoryInterface } from "./RepositoryInterface";
import { CrawlerChannel, CrawlInfo } from "../CrawlerTypes";
import FileJson from '../../../File/FileJson';

export class LocalRepository implements RepositoryInterface
{
    private readonly crawlsFilePath: string;
    private readonly emptyChannelsFilePath: string;

    constructor(readonly databasePath: string)
    {
        this.crawlsFilePath = pathJoin(this.databasePath, 'crawls.json');
        this.emptyChannelsFilePath = pathJoin(this.databasePath, 'emptychannels.json');
    }

    async getCrawls(): Promise<CrawlInfo[]>
    {
        const loader = await this.getFileLoader<CrawlInfo[]>(this.crawlsFilePath);

        const crawls = await loader.loadFileJson();

        crawls.forEach(crawl => {
            crawl.runAt = new Date(crawl.runAt);
        });

        return Promise.resolve(crawls);
    }

    async getPreviousCrawl(): Promise<CrawlInfo | undefined> {
        const crawls = await this.getCrawls();

        // sort ASC
        const sortedCrawls = crawls.sort((a, b) => {
            if(a.runAt > b.runAt)
                return 1;
            
            if(b.runAt > a.runAt)
                return -1;

            return 0;
        });

        // last element will be the latest
        return sortedCrawls.pop();
    }
    
    async addPreviousCrawl(crawl: CrawlInfo): Promise<void> {
        const loader = await this.getFileLoader<CrawlInfo[]>(this.crawlsFilePath);
        const crawls = await loader.loadFileJson();

        crawls.push(crawl);

        loader.saveFileJson(crawls);
    }

    async getCrawlerEmptyChannels(): Promise<CrawlerChannel[]> {
        const loader = await this.getFileLoader<CrawlerChannel[]>(this.emptyChannelsFilePath);

        const channels = await loader.loadFileJson()

        channels.forEach(channel => {
            channel.lastUpdated = new Date(channel.lastUpdated);
        });

        return Promise.resolve(channels);
    }

    async setCrawlerEmptyChannels(channelList: CrawlerChannel[]): Promise<void> {
        const loader = await this.getFileLoader<CrawlerChannel[]>(this.emptyChannelsFilePath);

        return loader.saveFileJson(channelList);
    }

    async getChannelById(channelId: number): Promise<CrawlerChannel>
    {
        const loader = await this.getFileLoader<CrawlerChannel[]>(this.emptyChannelsFilePath);

        const channels = await loader.loadFileJson();
        const channel = channels.find(channel => channel.channelId === channelId);

        if(!channel)
            throw new Error('Unable to find channel id ' + channelId);

        return channel;
    }

    async setChannelNotified(channelId: number, notified: boolean): Promise<void>
    {
        const loader = await this.getFileLoader<CrawlerChannel[]>(this.emptyChannelsFilePath);

        const channels = await loader.loadFileJson();
        const channelToUpdate = channels.find(channel => channel.channelId === channelId);

        if(!channelToUpdate)
            return;

        channelToUpdate.isNotified = true;

        await loader.saveFileJson(channels);
    }

    /**
     * Get the fileloader. Initialize an empty file if it doesn't exist
     * @param filePath Path to the data file
     */
    private async getFileLoader<T>(filePath: string): Promise<FileJson<T>>
    {
        const loader = new FileJson<T>(filePath);
        loader.setBaseContents('[]');

        await loader.initializeFile();

        return loader;
    }
}