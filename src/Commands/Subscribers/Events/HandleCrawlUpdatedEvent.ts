import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import { SubscribesServerMessages } from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { Message } from '../../Message';
import { notConnectedError } from '../../../Bot/Error';
import { crawlerConfiguration } from '../../../Validation/Configuration';
import { CrawlerConfiguration } from '../../../Bot/Configuration/Configuration';

export class HandleCrawlUpdatedEvent implements SubscribesServerMessages {
    readonly subject = 'bot.server.*.evt.crawl.updated';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Joi.Schema {
        return crawlerConfiguration;
    }

    async handle(
        botManager: Manager,
        msg: Message<CrawlerConfiguration>
    ): Promise<Either<Failure<any>, boolean>> {
        if (!botManager.bot.isConnected) return left(notConnectedError());

        if (msg.data.zones.length === 0) {
            botManager.disableCrawler();
        } else {
            botManager.setCrawlerConfig(msg.data);
        }

        return right(true);
    }
}
