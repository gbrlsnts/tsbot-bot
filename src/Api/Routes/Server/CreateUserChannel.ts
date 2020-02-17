import { Route } from "../../ApiTypes";
import { Express } from "express";
import { CreateUserChannelAction } from "../../../Bot/Action/CreateUserChannel/CreateUserChannelAction";
import { Bot } from "../../../Bot/Bot";
import { ApiRoute } from "../../ApiRoute";

export class CreateUserChannel extends ApiRoute implements Route {
    constructor(private readonly app: Express, private readonly bot: Bot)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): void {
        this.app.post('/bot/server/createUserChannel', async (req, res) => {
            const createUserChannel = new CreateUserChannelAction(this.bot, req.body);
        
            createUserChannel.execute()
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
                
        });
    }
}