import { join as pathJoin } from 'path';
import { RepositoryInterface } from './RepositoryInterface';
import { CrawlerChannel, CrawlInfo } from '../Crawler/CrawlerTypes';
import FileJson from '../../File/FileJson';

export class LocalRepository implements RepositoryInterface {
    constructor(readonly databasePath: string) {}

    /**
     * Get all crawls
     */
    async getCrawls(serverId: number | string): Promise<CrawlInfo[]> {
        const loader = await this.getFileLoader<CrawlInfo[]>(
            this.getCrawlsFilePath(serverId)
        );

        const crawls = await loader.loadFileJson();

        crawls.forEach(crawl => {
            crawl.runAt = new Date(crawl.runAt);
        });

        return Promise.resolve(crawls);
    }

    /**
     * Get the previous crawl
     */
    async getPreviousCrawl(
        serverId: number | string
    ): Promise<CrawlInfo | undefined> {
        const crawls = await this.getCrawls(serverId);

        // sort ASC
        const sortedCrawls = crawls.sort((a, b) => {
            if (a.runAt > b.runAt) return 1;

            if (b.runAt > a.runAt) return -1;

            return 0;
        });

        // last element will be the latest
        return sortedCrawls.pop();
    }

    /**
     * Add a crawl
     * @param crawl The crawl info to add
     */
    async addCrawl(serverId: number | string, crawl: CrawlInfo): Promise<void> {
        const loader = await this.getFileLoader<CrawlInfo[]>(
            this.getCrawlsFilePath(serverId)
        );
        const crawls = await loader.loadFileJson();

        crawls.push(crawl);

        loader.saveFileJson(crawls);
    }

    /**
     * Get all inactive channels
     */
    async getCrawlerInactiveChannels(
        serverId: number | string
    ): Promise<CrawlerChannel[]> {
        const loader = await this.getFileLoader<CrawlerChannel[]>(
            this.getInactiveChannelsFilePath(serverId)
        );

        const channels = await loader.loadFileJson();

        channels.forEach(channel => {
            channel.lastUpdated = new Date(channel.lastUpdated);
        });

        return Promise.resolve(channels);
    }

    /**
     * Save all channels of a crawl
     * @param channelList The channel list to save
     */
    async setCrawlerInactiveChannels(
        serverId: number | string,
        channelList: CrawlerChannel[]
    ): Promise<void> {
        const loader = await this.getFileLoader<CrawlerChannel[]>(
            this.getInactiveChannelsFilePath(serverId)
        );

        return loader.saveFileJson(channelList);
    }

    /**
     * Get an inactive channel by Id
     * @param channelId The channel Id
     */
    async getChannelById(
        serverId: number | string,
        channelId: number
    ): Promise<CrawlerChannel> {
        const loader = await this.getFileLoader<CrawlerChannel[]>(
            this.getInactiveChannelsFilePath(serverId)
        );

        const channels = await loader.loadFileJson();
        const channel = channels.find(
            channel => channel.channelId === channelId
        );

        if (!channel) throw new Error('Unable to find channel id ' + channelId);

        return channel;
    }

    /**
     * Set a channel notified value
     * @param channelId The channel Id to set
     * @param notified The notified value
     */
    async setChannelNotified(
        serverId: number | string,
        channelId: number,
        notified: boolean
    ): Promise<void> {
        const loader = await this.getFileLoader<CrawlerChannel[]>(
            this.getInactiveChannelsFilePath(serverId)
        );

        const channels = await loader.loadFileJson();
        const channelToUpdate = channels.find(
            channel => channel.channelId === channelId
        );

        if (!channelToUpdate) return;

        channelToUpdate.isNotified = notified;

        await loader.saveFileJson(channels);
    }

    /**
     * Get the fileloader. Initialize an empty file if it doesn't exist
     * @param filePath Path to the data file
     */
    private async getFileLoader<T>(filePath: string): Promise<FileJson<T>> {
        const loader = new FileJson<T>(filePath);
        loader.setBaseContents('[]');

        await loader.initializeFile();

        return loader;
    }

    /**
     * Get filepath of the crawls file
     * @param serverId
     */
    private getCrawlsFilePath(serverId: number | string): string {
        return pathJoin(
            this.databasePath,
            serverId.toString() + '_crawls.json'
        );
    }

    /**
     * Get filepath of the crawls file
     * @param serverId
     */
    private getInactiveChannelsFilePath(serverId: number | string): string {
        return pathJoin(
            this.databasePath,
            serverId.toString() + '_inactive-channels.json'
        );
    }
}
