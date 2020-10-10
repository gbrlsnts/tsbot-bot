import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import { SubscribesServerMessages } from '../Interfaces';
import { Either, Failure } from '../../../Lib/Library';
import { Message } from '../../Message';
import IconUploadAction from '../../../Bot/Action/Icon/IconUploadAction';

export class IconUploadSubscriber implements SubscribesServerMessages {
    readonly subject = 'bot.server.*.icon.upload';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.Schema = Joi.string().required().base64();

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Joi.Schema {
        return this.schema;
    }

    handle(
        botManager: Manager,
        msg: Message<string>
    ): Promise<Either<Failure<any>, any>> {
        return new IconUploadAction(botManager.bot, {
            icon: Buffer.from(msg.data, 'base64'),
        }).execute();
    }
}
