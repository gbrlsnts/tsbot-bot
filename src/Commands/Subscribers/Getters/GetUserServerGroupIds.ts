import Manager from '../../../Bot/Manager';
import { SubscribesServerMessages } from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { Message } from '../../Message';
import { invalidClientError, notConnectedError } from '../../../Bot/Error';

export class GetUserServerGroupIdsSubscriber
    implements SubscribesServerMessages {
    readonly subject = 'bot.server.*.user.sgroups';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): null {
        return null;
    }

    async handle(
        botManager: Manager,
        msg: Message<number>
    ): Promise<Either<Failure<any>, any>> {
        if (!botManager.bot.isConnected) return left(notConnectedError());

        const client = await botManager.bot.getClientByDatabaseId(msg.data);

        if (!client) return left(invalidClientError());

        return right(client.servergroups || []);
    }
}
