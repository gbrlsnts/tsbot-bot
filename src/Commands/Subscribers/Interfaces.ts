import Joi from '@hapi/joi';
import { Either, Failure } from '../../Lib/Library';
import { Message } from '../Message';

export interface SubscriberInterface {
    getSubject(): string;
    getValidationSchema(): Joi.ObjectSchema | null;
    handle(msg: Message<any>): Promise<Either<Failure<any>, any>>;
}

export interface HandleServerMessagesInterface {
    /**
     * Get subject's fragment position which contains the server id
     */
    getServerIdPosition(): number;
}

export declare type ServerMsgSubscriber = SubscriberInterface &
    HandleServerMessagesInterface;
