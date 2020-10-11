import { CrawlInfo, CrawlerChannel } from '../../Crawler/CrawlerTypes';
import { RepositoryInterface } from '../RepositoryInterface';
import { NatsConnector } from '../../../Commands/Nats/Connector';
import {
    getFindInactiveChannelByIdSubject,
    getAddCrawlSubject,
    getAllInactiveChannelsSubject,
    getSetInactiveChannelsSubject,
    getAllCrawlsSubject,
    getPrevCrawlSubject,
    getSetInactiveChannelNotifiedSubject,
} from './RepositoryNatsSubjects';

export class NatsRepository implements RepositoryInterface {
    constructor(private readonly nats: NatsConnector) {}

    async getCrawls(serverId: number | string): Promise<CrawlInfo[]> {
        const msg = await this.nats.request(getAllCrawlsSubject(serverId));

        msg.data.forEach((crawl: { runAt: string | number | Date }) => {
            crawl.runAt = new Date(crawl.runAt);
        });

        return msg.data;
    }

    async getPreviousCrawl(
        serverId: number | string
    ): Promise<CrawlInfo | undefined> {
        const msg = await this.nats.request(getPrevCrawlSubject(serverId));

        msg.data.runAt = new Date(msg.data.runAt);

        return msg.data;
    }

    async addCrawl(serverId: number | string, crawl: CrawlInfo): Promise<void> {
        await this.nats.request(getAddCrawlSubject(serverId), { crawl });
    }

    async getCrawlerInactiveChannels(
        serverId: number | string
    ): Promise<CrawlerChannel[]> {
        const msg = await this.nats.request(
            getAllInactiveChannelsSubject(serverId)
        );

        msg.data.forEach((channel: { lastUpdated: string | number | Date }) => {
            channel.lastUpdated = new Date(channel.lastUpdated);
        });

        return msg.data;
    }

    async setCrawlerInactiveChannels(
        serverId: number | string,
        channelList: CrawlerChannel[]
    ): Promise<void> {
        await this.nats.request(getSetInactiveChannelsSubject(serverId), {
            channelList,
        });
    }

    async getChannelById(
        serverId: number | string,
        channelId: number
    ): Promise<CrawlerChannel> {
        const msg = await this.nats.request(
            getFindInactiveChannelByIdSubject(serverId),
            {
                channelId,
            }
        );

        msg.data.lastUpdatedAt = new Date(msg.data.lastUpdatedAt);

        return msg.data;
    }

    async setChannelNotified(
        serverId: number | string,
        channelId: number,
        notified: boolean
    ): Promise<void> {
        await this.nats.request(
            getSetInactiveChannelNotifiedSubject(serverId),
            {
                channelId,
                notified,
            }
        );
    }
}
