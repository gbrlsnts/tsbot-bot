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
import { GetIconsResult } from './Types';

export class GetIconsSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.icon.list';
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
        let { data } = msg;

        if (!this.bot.isConnected) return left(notConnectedError());

        if (data.length === 0) data = await this.bot.getAllIconIds();

        const icons: GetIconsResult = await Promise.all(
            data.map(async id => ({
                iconId: id,
                content: (await this.bot.downloadIcon(id)).toString('base64'),
            }))
        );

        return right(icons);
    }
}
