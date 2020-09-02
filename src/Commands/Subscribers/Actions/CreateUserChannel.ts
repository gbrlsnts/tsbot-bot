import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure } from '../../../Lib/Library';
import { CreateUserChannelAction } from '../../../Bot/Action/UserChannel/CreateUserChannelAction';
import { CreateUserChannelData } from '../../../Bot/Action/UserChannel/UserChannelTypes';
import { createChannel } from '../../../Validation/UserChannel/UserChannelValidationRules';
import { Message } from '../../Message';

export class CreateUserChannelSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.channel.create';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.ObjectSchema = Joi.object(createChannel);

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
        msg: Message<CreateUserChannelData>
    ): Promise<Either<Failure<any>, any>> {
        return new CreateUserChannelAction(
            this.manager.logger,
            this.manager.bot,
            msg.data
        ).execute();
    }
}
