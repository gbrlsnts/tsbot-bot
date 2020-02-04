"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    getCrawls() {
        return __awaiter(this, void 0, void 0, function* () {
            const loader = yield this.getFileLoader(this.crawlsFilePath);
            const crawls = yield loader.loadFileJson();
            crawls.forEach(crawl => {
                crawl.runAt = new Date(crawl.runAt);
            });
            return Promise.resolve(crawls);
        });
    }
    getPreviousCrawl() {
        return __awaiter(this, void 0, void 0, function* () {
            const crawls = yield this.getCrawls();
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
        });
    }
    addPreviousCrawl(crawl) {
        return __awaiter(this, void 0, void 0, function* () {
            const loader = yield this.getFileLoader(this.crawlsFilePath);
            const crawls = yield loader.loadFileJson();
            crawls.push(crawl);
            loader.saveFileJson(crawls);
        });
    }
    getCrawlerEmptyChannels() {
        return __awaiter(this, void 0, void 0, function* () {
            const loader = yield this.getFileLoader(this.emptyChannelsFilePath);
            const channels = yield loader.loadFileJson();
            channels.forEach(channel => {
                channel.lastUpdated = new Date(channel.lastUpdated);
            });
            return Promise.resolve(channels);
        });
    }
    setCrawlerEmptyChannels(channelList) {
        return __awaiter(this, void 0, void 0, function* () {
            const loader = yield this.getFileLoader(this.emptyChannelsFilePath);
            return loader.saveFileJson(channelList);
        });
    }
    /**
     * Get the fileloader. Initialize an empty file if it doesn't exist
     * @param filePath Path to the data file
     */
    getFileLoader(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const loader = new FileJson_1.default(filePath);
            loader.setBaseContents('[]');
            yield loader.initializeFile();
            return loader;
        });
    }
}
exports.LocalRepository = LocalRepository;
//# sourceMappingURL=LocalRepository.js.map