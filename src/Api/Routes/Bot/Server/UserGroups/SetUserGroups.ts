import { Express } from 'express';
import Joi from '@hapi/joi';
import { Route } from '../../../../ApiTypes';
import { ApiRoute } from '../../../../ApiRoute';
import { Bot } from '../../../../../Bot/Bot';
import Validator from '../../../../../Validation/Validator';
import SetUserGroupsAction from '../../../../../Bot/Action/UserGroups/SetUserGroupsAction';
import Logger from '../../../../../Log/Logger';
import { setUserGroupsBase } from '../../../../../Validation/UserGroups';

export default class SetUserGroups extends ApiRoute implements Route {
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

        this.app.post(this.getWithPrefix('setUserGroups'), async (req, res) => {
            validator
                .validate(req.body)
                .then(() =>
                    new SetUserGroupsAction(this.bot, {
                        ...req.body,
                        trustedSource: false,
                    }).execute()
                )
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });

        return this;
    }

    /**
     * Get the validation schema
     */
    protected getSchema(): Joi.ObjectSchema {
        return Joi.object(setUserGroupsBase);
    }
}
