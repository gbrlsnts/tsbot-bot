import { Route } from "../../ApiTypes";
import { Express } from "express";
import { Bot } from "../../../Bot/Bot";
import { ApiRoute } from "../../ApiRoute";
import { DeleteUserChannelAction } from "../../../Bot/Action/UserChannel/DeleteUserChannel/DeleteUserChannelAction";

export class DeleteUserChannel extends ApiRoute implements Route {
    constructor(private readonly app: Express, private readonly bot: Bot)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): void {
        this.app.post('/bot/server/deleteUserChannel', async (req, res) => {
            const deleteUserChannel = new DeleteUserChannelAction(this.bot, req.body);
        
            deleteUserChannel.execute()
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
                
        });
    }
}