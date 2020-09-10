import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure, right, left } from '../../../Lib/Library';
import { Message } from '../../Message';
import { iconIds } from '../../../Validation/SharedRules';
import IconDeleteAction from '../../../Bot/Action/Icon/IconDeleteAction';

export class IconDeleteSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.icon.delete';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.ArraySchema = iconIds;

    constructor(private manager: Manager) {}

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Joi.ArraySchema {
        return this.schema;
    }

    async handle(msg: Message<number[]>): Promise<Either<Failure<any>, any>> {
        const result = await Promise.all(
            msg.data.map(iconId => {
                return new IconDeleteAction(this.manager.bot, {
                    iconId,
                }).execute();
            })
        );

        const errors: Failure<any>[] = [];

        result.forEach(res => {
            if (res.isLeft()) errors.push(res.value);
        });

        if (errors.length > 0)
            return left({
                type: errors.map(e => e.type).join(','),
                reason: errors.map(e => e.reason).join(','),
            });

        return right(true);
    }
}
