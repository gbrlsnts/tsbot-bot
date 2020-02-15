"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const FileJson_1 = __importDefault(require("../../../File/FileJson"));
class LocalRepository {
    constructor(databasePath) {
        this.databasePath = databasePath;
        this.crawlsFilePath = path_1.join(this.databasePath, 'crawls.json');
        this.emptyChannelsFilePath = path_1.join(this.databasePath, 'emptychannels.json');
    }
    /**
     * Get all crawls
     */
    async getCrawls() {
        const loader = await this.getFileLoader(this.crawlsFilePath);
        const crawls = await loader.loadFileJson();
        crawls.forEach(crawl => {
            crawl.runAt = new Date(crawl.runAt);
        });
        return Promise.resolve(crawls);
    }
    /**
     * Get the previous crawl
     */
    async getPreviousCrawl() {
        const crawls = await this.getCrawls();
        // sort ASC
        const sortedCrawls = crawls.sort((a, b) => {
            if (a.runAt > b.runAt)
                return 1;
            if (b.runAt > a.runAt)
                return -1;
            return 0;
        });
        // last element will be the latest
        return sortedCrawls.pop();
    }
    /**
     * Add a crawl
     * @param crawl The crawl info to add
     */
    async addPreviousCrawl(crawl) {
        const loader = await this.getFileLoader(this.crawlsFilePath);
        const crawls = await loader.loadFileJson();
        crawls.push(crawl);
        loader.saveFileJson(crawls);
    }
    /**
     * Get all empty channels
     */
    async getCrawlerEmptyChannels() {
        const loader = await this.getFileLoader(this.emptyChannelsFilePath);
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
    async setCrawlerEmptyChannels(channelList) {
        const loader = await this.getFileLoader(this.emptyChannelsFilePath);
        return loader.saveFileJson(channelList);
    }
    /**
     * Get an empty channel by Id
     * @param channelId The channel Id
     */
    async getChannelById(channelId) {
        const loader = await this.getFileLoader(this.emptyChannelsFilePath);
        const channels = await loader.loadFileJson();
        const channel = channels.find(channel => channel.channelId === channelId);
        if (!channel)
            throw new Error('Unable to find channel id ' + channelId);
        return channel;
    }
    /**
     * Set a channel notified value
     * @param channelId The channel Id to set
     * @param notified The notified value
     */
    async setChannelNotified(channelId, notified) {
        const loader = await this.getFileLoader(this.emptyChannelsFilePath);
        const channels = await loader.loadFileJson();
        const channelToUpdate = channels.find(channel => channel.channelId === channelId);
        if (!channelToUpdate)
            return;
        channelToUpdate.isNotified = true;
        await loader.saveFileJson(channels);
    }
    /**
     * Get the fileloader. Initialize an empty file if it doesn't exist
     * @param filePath Path to the data file
     */
    async getFileLoader(filePath) {
        const loader = new FileJson_1.default(filePath);
        loader.setBaseContents('[]');
        await loader.initializeFile();
        return loader;
    }
}
exports.LocalRepository = LocalRepository;
//# sourceMappingURL=LocalRepository.js.map