import { Repository } from "./RepositoryInterface";
import { CrawlerChannel } from "../Entities/Channel";

export class LocalRepository implements Repository
{
    getCrawlerEmptyChannels(): CrawlerChannel[] {
        throw new Error("Method not implemented.");
    }
    
    setCrawlerEmptyChannels(channelList: CrawlerChannel[]): void {
        throw new Error("Method not implemented.");
    }
}