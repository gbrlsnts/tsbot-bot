import { Express } from "express";
import { Route } from "../../../../ApiTypes";
import { ApiRoute } from "../../../../ApiRoute";
import { Bot } from "../../../../../Bot/Bot";
import VerifyUserAction from "../../../../../Bot/Action/VerifyUser/VerifyUserAction";

export default class VerifyUser extends ApiRoute implements Route
{
    constructor(private readonly app: Express, private readonly bot: Bot)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): this {
        this.app.post(this.getWithPrefix('verifyUser'), async (req, res) => {
            new VerifyUserAction(this.bot, req.body).execute()
                .then((result) => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });

        return this;
    }

}