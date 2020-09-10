import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure } from '../../../Lib/Library';
import { Message } from '../../Message';
import IconUploadAction from '../../../Bot/Action/Icon/IconUploadAction';

export class IconUploadSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.icon.upload';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.Schema = Joi.string().required().base64();

    constructor(private manager: Manager) {}

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Joi.Schema {
        return this.schema;
    }

    handle(msg: Message<string>): Promise<Either<Failure<any>, any>> {
        return new IconUploadAction(this.manager.bot, {
            icon: Buffer.from(msg.data, 'base64'),
        }).execute();
    }
}
