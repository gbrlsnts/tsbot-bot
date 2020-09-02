import Joi from '@hapi/joi';
import Manager from '../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from './Interfaces';
import { Either, Failure } from '../../Lib/Library';
import { CreateUserSubChannelAction } from '../../Bot/Action/UserChannel/CreateUserSubChannelAction';
import { CreateSubChannelData } from '../../Bot/Action/UserChannel/UserChannelTypes';
import { createChannel } from '../../Validation/UserChannel/UserChannelValidationRules';
import { Message } from '../Message';

export class CreateUserSubChannelSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.channel.sub.create';
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
        msg: Message<CreateSubChannelData>
    ): Promise<Either<Failure<any>, any>> {
        return new CreateUserSubChannelAction(
            this.manager.logger,
            this.manager.bot,
            msg.data
        ).execute();
    }
}
