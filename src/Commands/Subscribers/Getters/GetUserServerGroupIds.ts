import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { Message } from '../../Message';
import { Bot } from '../../../Bot/Bot';
import { invalidClientError, notConnectedError } from '../../../Bot/Error';

export class GetUserServerGroupIdsSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.user.sgroups';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly bot: Bot;

    constructor(private manager: Manager) {
        this.bot = manager.bot;
    }

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): null {
        return null;
    }

    async handle(msg: Message<number>): Promise<Either<Failure<any>, any>> {
        if (!this.bot.isConnected) return left(notConnectedError());

        const client = await this.bot.getClientByDatabaseId(msg.data);

        if (!client) return left(invalidClientError());

        return right(client.servergroups || []);
    }
}
