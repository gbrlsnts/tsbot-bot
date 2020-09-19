import { Express } from 'express';
import Joi from '@hapi/joi';
import { Route } from '../../../../ApiTypes';
import { ApiRoute } from '../../../../ApiRoute';
import { Bot } from '../../../../../Bot/Bot';
import VerifyUserAction from '../../../../../Bot/Action/VerifyUser/VerifyUserAction';
import Validator from '../../../../../Validation/Validator';
import Logger from '../../../../../Log/Logger';
import { verifyUser } from '../../../../../Validation/User';

export default class VerifyUser extends ApiRoute implements Route {
    constructor(
        private readonly app: Express,
        private readonly bot: Bot,
        globalLogger: Logger
    ) {
        super(globalLogger);
    }

    /**
     * Register the route
     */
    register(): this {
        const validator = new Validator(this.getSchema());

        this.app.post(this.getWithPrefix('verifyUser'), async (req, res) => {
            validator
                .validate(req.body)
                .then(() => new VerifyUserAction(this.bot, req.body).execute())
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });

        return this;
    }

    /**
     * Get the validation schema
     */
    protected getSchema(): Joi.ObjectSchema {
        return verifyUser;
    }
}
