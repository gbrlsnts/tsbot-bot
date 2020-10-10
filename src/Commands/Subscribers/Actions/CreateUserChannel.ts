import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import { SubscribesServerMessages } from '../Interfaces';
import { Either, Failure } from '../../../Lib/Library';
import { CreateUserChannelAction } from '../../../Bot/Action/UserChannel/CreateUserChannelAction';
import { CreateUserChannelData } from '../../../Bot/Action/UserChannel/UserChannelTypes';
import { createChannel } from '../../../Validation/UserChannel/UserChannelValidationRules';
import { Message } from '../../Message';

export class CreateUserChannelSubscriber implements SubscribesServerMessages {
    readonly subject = 'bot.server.*.channel.create';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.ObjectSchema = Joi.object(createChannel);

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
        msg: Message<CreateUserChannelData>
    ): Promise<Either<Failure<any>, any>> {
        return new CreateUserChannelAction(
            botManager.logger,
            botManager.bot,
            msg.data
        ).execute();
    }
}
