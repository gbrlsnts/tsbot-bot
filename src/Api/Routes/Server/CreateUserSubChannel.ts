import { Route } from "../../ApiTypes";
import { Express } from "express";
import { Bot } from "../../../Bot/Bot";
import { ApiRoute } from "../../ApiRoute";
import { CreateUserSubChannelAction } from "../../../Bot/Action/UserChannel/CreateUserSubChannel/CreateUserSubChannelAction";

export class CreateUserSubChannel extends ApiRoute implements Route {
    constructor(private readonly app: Express, private readonly bot: Bot)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): void {
        this.app.post('/bot/server/createUserSubChannel', async (req, res) => {
            const createUserSubChannel = new CreateUserSubChannelAction(this.bot, req.body);
        
            createUserSubChannel.execute()
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
                
        });
    }
}