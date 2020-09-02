import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure } from '../../../Lib/Library';
import { DeleteChannelData } from '../../../Bot/Action/UserChannel/UserChannelTypes';
import { deleteChannel } from '../../../Validation/UserChannel/UserChannelValidationRules';
import { DeleteUserChannelAction } from '../../../Bot/Action/UserChannel/DeleteUserChannelAction';
import { Message } from '../../Message';

export class DeleteUserChannelSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.channel.delete';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.ObjectSchema = Joi.object(deleteChannel);

    constructor(private manager: Manager) {}

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Joi.ObjectSchema {
        return this.schema;
    }

    handle(
        msg: Message<DeleteChannelData>
    ): Promise<Either<Failure<any>, any>> {
        return new DeleteUserChannelAction(
            this.manager.logger,
            this.manager.bot,
            msg.data
        ).execute();
    }
}
