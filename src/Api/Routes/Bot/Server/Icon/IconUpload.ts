import { Express } from "express";
import Joi from "@hapi/joi";
import { Route } from "../../../../ApiTypes";
import { ApiRoute } from "../../../../ApiRoute";
import { Bot } from "../../../../../Bot/Bot";
import Validator from "../../../../Validator";
import IconUploadAction from "../../../../../Bot/Action/Icon/IconUploadAction";
import { IconUploadData } from "../../../../../Bot/Action/Icon/IconActionTypes";

export default class IconUpload extends ApiRoute implements Route
{
    constructor(private readonly app: Express, private readonly bot: Bot)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): this {
        const validator = new Validator(this.getSchema());

        this.app.post(this.getWithPrefix('iconUpload'), async (req, res) => {
            validator.validate(req.body)
                .then(() => this.mapRequest(req.body))
                .then((data) => new IconUploadAction(this.bot, data).execute())
                .then((result) => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });

        return this;
    }

    /**
     * Map the incoming request to action data
     * @param request request to map
     */
    protected async mapRequest(request: { icon: string }): Promise<IconUploadData>
    {
        return Promise.resolve({
            icon: Buffer.from(request.icon, 'base64'),
        });
    }

    /**
     * Get the validation schema
     */
    protected getSchema(): Joi.ObjectSchema
    {
        return Joi.object({
            icon: Joi.string().required().min(1),
        });
    }

}