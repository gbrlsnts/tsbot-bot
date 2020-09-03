import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { channelId } from '../../../Validation/SharedRules';
import { Message } from '../../Message';
import { Bot } from '../../../Bot/Bot';
import { notConnectedError, invalidChannelError } from '../../../Bot/Error';
import { ChannelUtils } from '../../../Bot/Utils/ChannelUtils';
import { ChannelIdRequest } from './Types';

export class GetSubChannelCountSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.channel.sub.count';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.ObjectSchema = Joi.object(channelId);
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

    getValidationSchema(): Joi.ObjectSchema {
        return this.schema;
    }

    async handle(
        msg: Message<ChannelIdRequest>
    ): Promise<Either<Failure<any>, any>> {
        const {
            data: { channelId },
        } = msg;

        if (!this.bot.isConnected) return left(notConnectedError());

        const channels = await this.bot.getServer().channelList();

        if (channels.findIndex(c => c.cid === channelId) === -1)
            return left(invalidChannelError());

        const count = ChannelUtils.getAllSubchannels(channelId, channels)
            .length;

        return right(count);
    }
}
