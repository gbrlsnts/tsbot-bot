import { join as pathJoin } from 'path';
import { Repository } from "./RepositoryInterface";
import { CrawlerChannel, CrawlInfo } from "../CrawlerTypes";
import FileJson from '../../../File/FileJson';

export class LocalRepository implements Repository
{
    private readonly crawlsFilePath: string;
    private readonly emptyChannelsFilePath: string;

    constructor(readonly databasePath: string)
    {
        this.crawlsFilePath = pathJoin(this.databasePath, 'crawls.json');
        this.emptyChannelsFilePath = pathJoin(this.databasePath, 'emptychannels.json');
    }

    async getPreviousCrawl(): Promise<CrawlInfo | undefined> {
        const crawls = await new FileJson<CrawlInfo[]>(this.crawlsFilePath).loadFileJson();

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
        const file = new FileJson<CrawlInfo[]>(this.crawlsFilePath);
        const crawls = await file.loadFileJson();

        crawls.push(crawl);

        file.saveFileJson(crawls);
    }

    async getCrawlerEmptyChannels(): Promise<CrawlerChannel[]> {
        return new FileJson<CrawlerChannel[]>(this.emptyChannelsFilePath).loadFileJson();
    }

    setCrawlerEmptyChannels(channelList: CrawlerChannel[]): Promise<void> {
        return new FileJson<CrawlerChannel[]>(this.emptyChannelsFilePath).saveFileJson(channelList);
    }
}