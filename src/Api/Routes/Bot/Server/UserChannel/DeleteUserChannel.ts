import { Route } from "../../../../ApiTypes";
import { Express } from "express";
import { Bot } from "../../../../../Bot/Bot";
import { ApiRoute } from "../../../../ApiRoute";
import { DeleteUserChannelAction } from "../../../../../Bot/Action/UserChannel/DeleteUserChannelAction";
import Joi = require("@hapi/joi");
import { deleteChannel } from "./ValidationRules";
import Validator from "../../../../Validator";
import Logger from "../../../../../Log/Logger";

export class DeleteUserChannel extends ApiRoute implements Route {
    constructor(private readonly app: Express, private readonly bot: Bot, logger: Logger)
    {
        super(logger);
    }

    /**
     * Register the route
     */
    register(): this
    {
        const validator = new Validator(this.getSchema());

        this.app.post(this.getWithPrefix('deleteUserChannel'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new DeleteUserChannelAction(this.bot, req.body).execute())
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
        return Joi.object(deleteChannel);
    }
}