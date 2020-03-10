import Joi from "@hapi/joi";
import { Route } from "../../../../ApiTypes";
import { Express } from "express";
import { CreateUserChannelAction } from "../../../../../Bot/Action/UserChannel/CreateUserChannel/CreateUserChannelAction";
import { Bot } from "../../../../../Bot/Bot";
import { ApiRoute } from "../../../../ApiRoute";
import { createChannel } from "./ValidationRules";
import Validator from "../../../../Validator";

export class CreateUserChannel extends ApiRoute implements Route {
    constructor(private readonly app: Express, private readonly bot: Bot)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): this
    {
        const validator = new Validator(this.getSchema());

        this.app.post(this.getWithPrefix('createUserChannel'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new CreateUserChannelAction(this.bot, req.body).execute())
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