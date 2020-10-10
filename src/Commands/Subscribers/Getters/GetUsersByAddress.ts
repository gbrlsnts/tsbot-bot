import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import { SubscribesServerMessages } from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { Message } from '../../Message';
import { clientIpAddress } from '../../../Validation/SharedRules';
import { notConnectedError } from '../../../Bot/Error';

export class GetUsersByAddressSubscriber implements SubscribesServerMessages {
    readonly subject = 'bot.server.*.user.get-by-addr';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Joi.Schema {
        return clientIpAddress;
    }

    async handle(
        botManager: Manager,
        msg: Message<string>
    ): Promise<Either<Failure<any>, any>> {
        const address = msg.data;

        if (!botManager.bot.isConnected) return left(notConnectedError());

        const clients = await botManager.bot.getClientsByAddress(address);

        return right(
            clients.map(c => ({
                id: c.clid,
                dbId: c.databaseId,
                uid: c.uniqueIdentifier,
            }))
        );
    }
}
