import { Express } from "express";
import Joi from "@hapi/joi";
import { Route } from "../../../../ApiTypes";
import { ApiRoute } from "../../../../ApiRoute";
import { Bot } from "../../../../../Bot/Bot";
import Validator from "../../../../Validator";
import IconDeleteAction from "../../../../../Bot/Action/Icon/IconDeleteAction";
import Logger from "../../../../../Log/Logger";

export default class IconDelete extends ApiRoute implements Route
{
    constructor(private readonly app: Express, private readonly bot: Bot, globalLogger: Logger)
    {
        super(globalLogger);
    }

    /**
     * Register the route
     */
    register(): this {
        const validator = new Validator(this.getSchema());

        this.app.post(this.getWithPrefix('iconDelete'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new IconDeleteAction(this.bot, req.body).execute())
                .then((result) => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });

        return this;
    }

    /**
     * Get the validation schema
     */
    protected getSchema(): Joi.ObjectSchema
    {
        return Joi.object({
            iconId: Joi.number().required().min(1),
        });
    }

}