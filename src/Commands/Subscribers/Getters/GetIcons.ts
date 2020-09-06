import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { Message } from '../../Message';
import { Bot } from '../../../Bot/Bot';
import { notConnectedError } from '../../../Bot/Error';
import { iconIds } from '../../../Validation/SharedRules';

export class GetIconsSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.icons.get';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.ArraySchema = iconIds;
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
        return this.schema;
    }

    async handle(msg: Message<number[]>): Promise<Either<Failure<any>, any>> {
        const { data } = msg;

        if (!this.bot.isConnected) return left(notConnectedError());

        const icons = await Promise.all(
            data.map(async id => ({
                iconId: data,
                content: (await this.bot.downloadIcon(id)).toString('base64'),
            }))
        );

        return right(icons);
    }
}
