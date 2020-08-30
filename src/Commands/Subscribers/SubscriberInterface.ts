import { Either, Failure } from '../../Lib/Library';
import Joi from '@hapi/joi';

export interface SubscriberInterface {
    getSubject(): string;
    getValidationSchema(): Joi.ObjectSchema | null;
    handle(msg: object): Promise<Either<Failure<any>, any>>;
}
