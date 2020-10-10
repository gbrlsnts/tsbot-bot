import Joi from '@hapi/joi';
import { Either, Failure } from '../../Lib/Library';
import { Message } from '../Message';
import Manager from '../../Bot/Manager';

export interface SubscriberInterface {
    getSubject(): string;
    getValidationSchema(): Joi.Schema | null;
}

export interface SubscribesMessages extends SubscriberInterface {
    handle(msg: Message<any>): Promise<Either<Failure<any>, any>>;
}

export interface SubscribesServerMessages extends SubscriberInterface {
    /**
     * Get subject's fragment position which contains the server id
     */
    getServerIdPosition(): number;

    handle(
        botManager: Manager,
        msg: Message<any>
    ): Promise<Either<Failure<any>, any>>;
}

export declare type Subscriber = SubscribesMessages | SubscribesServerMessages;
