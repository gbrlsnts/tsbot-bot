import Joi from '@hapi/joi';
import Manager from '../../Bot/Manager';
import { SubscriberInterface } from './SubscriberInterface';
import { Either, Failure } from '../../Lib/Library';
import { CreateUserChannelAction } from '../../Bot/Action/UserChannel/CreateUserChannelAction';
import { CreateUserChannelData } from '../../Bot/Action/UserChannel/UserChannelTypes';
import { createChannel } from '../../Validation/UserChannel/UserChannelValidationRules';

export class CreateUserChannelSubscriber implements SubscriberInterface {
    readonly subject = 'bot.server.*.channel.create';
    readonly schema: Joi.ObjectSchema = Joi.object(createChannel);

    constructor(private manager: Manager) {}

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Joi.ObjectSchema {
        return this.schema;
    }

    handle(msg: CreateUserChannelData): Promise<Either<Failure<any>, any>> {
        return new CreateUserChannelAction(
            this.manager.logger,
            this.manager.bot,
            msg
        ).execute();
    }
}
