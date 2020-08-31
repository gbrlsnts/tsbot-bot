import Joi from '@hapi/joi';
import Manager from '../../Bot/Manager';
import { SubscriberInterface } from './SubscriberInterface';
import { Either, Failure } from '../../Lib/Library';
import { DeleteChannelData } from '../../Bot/Action/UserChannel/UserChannelTypes';
import { deleteChannel } from '../../Validation/UserChannel/UserChannelValidationRules';
import { DeleteUserChannelAction } from '../../Bot/Action/UserChannel/DeleteUserChannelAction';

export class DeleteUserChannelSubscriber implements SubscriberInterface {
    readonly subject = 'bot.server.*.channel.delete';
    readonly schema: Joi.ObjectSchema = Joi.object(deleteChannel);

    constructor(private manager: Manager) {}

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Joi.ObjectSchema {
        return this.schema;
    }

    handle(msg: DeleteChannelData): Promise<Either<Failure<any>, any>> {
        return new DeleteUserChannelAction(
            this.manager.logger,
            this.manager.bot,
            msg
        ).execute();
    }
}
