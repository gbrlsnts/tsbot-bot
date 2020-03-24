import { Express } from "express";
import Joi from "@hapi/joi";
import { ApiRoute } from "../../../ApiRoute";
import { Route } from "../../../ApiTypes";
import Validator from "../../../Validator";
import Manager from "../../../../Bot/Manager";
import { right } from "../../../../Lib/Either";
import Logger from "../../../../Log/Logger";

export default class SetConfig extends ApiRoute implements Route
{
    constructor(private readonly app: Express, private readonly manager: Manager, logger: Logger)
    {
        super(logger);
    }

    /**
     * Register the route
     */
    register(): this {
        const validator = new Validator(this.getSchema());

        this.app.post(this.getWithPrefix('setConfig'), async (req, res) => {
            validator.validate(req.body)
                .then((config) => this.manager.setCrawlerConfig(config))
                .then(() => this.mapToResponse(res, right(true)).send())
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
            interval: Joi.number().required().min(30).max(14400),
            zones: Joi.array().required().min(1).items(Joi.object().keys({
                name: Joi.string().required().min(1),
                spacerAsSeparator: Joi.boolean().required(),
                start: Joi.number().required().min(1),
                end: Joi.number().required().min(1),
                inactiveIcon: Joi.number().min(1),
                timeInactiveNotify: Joi.number().required().min(1),
                timeInactiveMax: Joi.number().required().min(1).greater(Joi.ref('timeInactiveNotify')),
            })),
        });
    }

}