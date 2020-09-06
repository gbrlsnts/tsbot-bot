import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { Message } from '../../Message';
import { Bot } from '../../../Bot/Bot';
import { notConnectedError } from '../../../Bot/Error';
import { ClientType } from 'ts3-nodejs-library';

export class GetServerGroupsSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.server-groups.get';
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

    async handle(msg: Message<void>): Promise<Either<Failure<any>, any>> {
        if (!this.bot.isConnected) return left(notConnectedError());

        const groups = await this.bot.getServer().serverGroupList({
            type: ClientType.ServerQuery,
        });

        return right(
            groups.map(g => ({
                tsId: g.sgid,
                iconId: g.iconid,
                name: g.name,
            }))
        );
    }
}
