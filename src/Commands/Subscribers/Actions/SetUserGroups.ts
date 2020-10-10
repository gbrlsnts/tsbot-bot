import Joi from '@hapi/joi';
import { SubscribesServerMessages } from '../Interfaces';
import Manager from '../../../Bot/Manager';
import { Message } from '../../Message';
import { SetUserGroupsData } from '../../../Bot/Action/UserGroups/SetUserGroupsTypes';
import { Either, Failure } from '../../../Lib/Library';
import SetUserGroupsAction from '../../../Bot/Action/UserGroups/SetUserGroupsAction';
import { setUserGroupsCommand } from '../../../Validation/UserGroups';

export class SetUserGroupsSubscriber implements SubscribesServerMessages {
    readonly subject = 'bot.server.*.badges.set';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.ObjectSchema = Joi.object(setUserGroupsCommand);

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
        msg: Message<SetUserGroupsData>
    ): Promise<Either<Failure<any>, any>> {
        return new SetUserGroupsAction(botManager.bot, {
            ...msg.data,
            trustedSource: true,
        }).execute();
    }
}
