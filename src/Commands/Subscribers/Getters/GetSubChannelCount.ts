import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import { SubscriberInterface, SubscribesServerMessages } from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { channelId } from '../../../Validation/SharedRules';
import { Message } from '../../Message';
import { notConnectedError, invalidChannelError } from '../../../Bot/Error';
import { ChannelUtils } from '../../../Bot/Utils/ChannelUtils';
import { ChannelIdRequest } from './Types';

export class GetSubChannelCountSubscriber implements SubscribesServerMessages {
    readonly subject = 'bot.server.*.channel.sub.count';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.ObjectSchema = Joi.object(channelId);

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
        botManager: Manager,
        msg: Message<ChannelIdRequest>
    ): Promise<Either<Failure<any>, any>> {
        const {
            data: { channelId },
        } = msg;

        if (!botManager.bot.isConnected) return left(notConnectedError());

        const channels = await botManager.bot.getServer().channelList();

        if (channels.findIndex(c => c.cid === channelId) === -1)
            return left(invalidChannelError());

        const count = ChannelUtils.getAllSubchannels(channelId, channels)
            .length;

        return right(count);
    }
}
