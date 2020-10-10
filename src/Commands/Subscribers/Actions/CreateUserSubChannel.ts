import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import { SubscribesServerMessages } from '../Interfaces';
import { Either, Failure } from '../../../Lib/Library';
import { CreateUserSubChannelAction } from '../../../Bot/Action/UserChannel/CreateUserSubChannelAction';
import { CreateSubChannelData } from '../../../Bot/Action/UserChannel/UserChannelTypes';
import { createSubChannel } from '../../../Validation/UserChannel/UserChannelValidationRules';
import { Message } from '../../Message';

export class CreateUserSubChannelSubscriber
    implements SubscribesServerMessages {
    readonly subject = 'bot.server.*.channel.sub.create';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.ObjectSchema = Joi.object(createSubChannel);

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
        botManager: Manager,
        msg: Message<CreateSubChannelData>
    ): Promise<Either<Failure<any>, any>> {
        return new CreateUserSubChannelAction(
            botManager.logger,
            botManager.bot,
            msg.data
        ).execute();
    }
}
