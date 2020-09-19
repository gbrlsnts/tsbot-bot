import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure } from '../../../Lib/Library';
import { Message } from '../../Message';
import { verifyUser } from '../../../Validation/User';
import VerifyUserAction from '../../../Bot/Action/VerifyUser/VerifyUserAction';
import { VerifyUserData } from '../../../Bot/Action/VerifyUser/VerifyUserTypes';

export class VerifyUserSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.user.verification';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');

    constructor(private manager: Manager) {}

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Joi.Schema {
        return verifyUser;
    }

    handle(msg: Message<VerifyUserData>): Promise<Either<Failure<any>, any>> {
        return new VerifyUserAction(this.manager.bot, msg.data).execute();
    }
}
