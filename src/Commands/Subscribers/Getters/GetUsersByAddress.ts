import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { Message } from '../../Message';
import { Bot } from '../../../Bot/Bot';
import { clientIpAddress } from '../../../Validation/SharedRules';
import { notConnectedError } from '../../../Bot/Error';

export class GetUsersByAddressSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.user.get-by-addr';
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

    getValidationSchema(): Joi.Schema {
        return clientIpAddress;
    }

    async handle(msg: Message<string>): Promise<Either<Failure<any>, any>> {
        const address = msg.data;

        if (!this.bot.isConnected) return left(notConnectedError());

        const clients = await this.bot.getClientsByAddress(address);

        return right(
            clients.map(c => ({
                id: c.clid,
                dbId: c.databaseId,
                uid: c.uniqueIdentifier,
            }))
        );
    }
}
