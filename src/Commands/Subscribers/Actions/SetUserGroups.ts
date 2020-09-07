import Joi from '@hapi/joi';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import Manager from '../../../Bot/Manager';
import { Message } from '../../Message';
import { SetUserGroupsData } from '../../../Bot/Action/UserGroups/SetUserGroupsTypes';
import { Either, Failure } from '../../../Lib/Library';
import SetUserGroupsAction from '../../../Bot/Action/UserGroups/SetUserGroupsAction';
import { setUserGroupsCommand } from '../../../Validation/UserGroups';

export class SetUserGroupsSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.badges.set';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.ObjectSchema = Joi.object(setUserGroupsCommand);

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
        msg: Message<SetUserGroupsData>
    ): Promise<Either<Failure<any>, any>> {
        return new SetUserGroupsAction(this.manager.bot, {
            ...msg.data,
            trustedSource: true,
        }).execute();
    }
}
