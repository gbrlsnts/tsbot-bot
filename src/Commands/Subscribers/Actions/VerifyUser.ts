import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import { SubscribesServerMessages } from '../Interfaces';
import { Either, Failure } from '../../../Lib/Library';
import { Message } from '../../Message';
import { verifyUser } from '../../../Validation/User';
import VerifyUserAction from '../../../Bot/Action/VerifyUser/VerifyUserAction';
import { VerifyUserData } from '../../../Bot/Action/VerifyUser/VerifyUserTypes';

export class VerifyUserSubscriber implements SubscribesServerMessages {
    readonly subject = 'bot.server.*.user.verification';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Joi.Schema {
        return verifyUser;
    }

    handle(
        botManager: Manager,
        msg: Message<VerifyUserData>
    ): Promise<Either<Failure<any>, any>> {
        return new VerifyUserAction(botManager.bot, msg.data).execute();
    }
}
