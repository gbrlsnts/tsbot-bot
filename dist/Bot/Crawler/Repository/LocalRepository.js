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
    async getCrawls() {
        const loader = await this.getFileLoader(this.crawlsFilePath);
        const crawls = await loader.loadFileJson();
        crawls.forEach(crawl => {
            crawl.runAt = new Date(crawl.runAt);
        });
        return Promise.resolve(crawls);
    }
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
    async addPreviousCrawl(crawl) {
        const loader = await this.getFileLoader(this.crawlsFilePath);
        const crawls = await loader.loadFileJson();
        crawls.push(crawl);
        loader.saveFileJson(crawls);
    }
    async getCrawlerEmptyChannels() {
        const loader = await this.getFileLoader(this.emptyChannelsFilePath);
        const channels = await loader.loadFileJson();
        channels.forEach(channel => {
            channel.lastUpdated = new Date(channel.lastUpdated);
        });
        return Promise.resolve(channels);
    }
    async setCrawlerEmptyChannels(channelList) {
        const loader = await this.getFileLoader(this.emptyChannelsFilePath);
        return loader.saveFileJson(channelList);
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