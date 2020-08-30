import { Express } from "express";
import Joi from "@hapi/joi";
import { Route } from "../../../../ApiTypes";
import { CreateUserChannelAction } from "../../../../../Bot/Action/UserChannel/CreateUserChannelAction";
import { ApiRoute } from "../../../../ApiRoute";
import { createChannel } from "./ValidationRules";
import Validator from "../../../../../Validation/Validator";
import Logger from "../../../../../Log/Logger";
import Manager from "../../../../../Bot/Manager";

export class CreateUserChannel extends ApiRoute implements Route {
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

        this.app.post(this.getWithPrefix('createUserChannel'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new CreateUserChannelAction(this.manager.logger, this.manager.bot, req.body).execute())
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
        return Joi.object(createChannel);
    }
}