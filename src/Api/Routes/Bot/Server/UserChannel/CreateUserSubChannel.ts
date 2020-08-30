import { Express } from "express";
import Joi = require("@hapi/joi");
import { Route } from "../../../../ApiTypes";
import { ApiRoute } from "../../../../ApiRoute";
import { CreateUserSubChannelAction } from "../../../../../Bot/Action/UserChannel/CreateUserSubChannelAction";
import { createSubChannel } from "../../../../../Validation/UserChannel/UserChannelValidationRules";
import Validator from "../../../../../Validation/Validator";
import Logger from "../../../../../Log/Logger";
import Manager from "../../../../../Bot/Manager";

export class CreateUserSubChannel extends ApiRoute implements Route {
    constructor(private readonly app: Express, private readonly manager: Manager, globalLogger: Logger)
    {
        super(globalLogger);
    }

    /**
     * Register the route
     */
    register(): this 
    {
        const validator = new Validator(this.getSchema());

        this.app.post(this.getWithPrefix('createUserSubChannel'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new CreateUserSubChannelAction(this.manager.logger, this.manager.bot, req.body).execute())
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });

        return this;
    }

    /**
     * Get the validation schema
     */
    protected getSchema(): Joi.ObjectSchema
    {
        return Joi.object(createSubChannel);
    }
}