import { Route } from "../../ApiTypes";
import { Express } from "express";
import { Bot } from "../../../Bot/Bot";
import { ApiRoute } from "../../ApiRoute";
import { CreateUserSubChannelAction } from "../../../Bot/Action/UserChannel/CreateUserSubChannel/CreateUserSubChannelAction";
import Joi = require("@hapi/joi");
import { createSubChannel } from "./ValidationRules";
import Validator from "../../Validator";

export class CreateUserSubChannel extends ApiRoute implements Route {
    constructor(private readonly app: Express, private readonly bot: Bot)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): void 
    {
        const validator = new Validator(this.getSchema());

        this.app.post('/bot/server/createUserSubChannel', async (req, res) => {
            validator.validate(req.body)
                .then(() => new CreateUserSubChannelAction(this.bot, req.body).execute())
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
    }

    /**
     * Get the validation schema
     */
    protected getSchema(): Joi.ObjectSchema
    {
        return Joi.object(createSubChannel);
    }
}