import { Express } from "express";
import { Route } from "../../../ApiTypes";
import { Bot } from "../../../../Bot/Bot";
import { CreateUserChannel } from "./UserChannel/CreateUserChannel";
import { CreateUserSubChannel } from "./UserChannel/CreateUserSubChannel";
import { DeleteUserChannel } from "./UserChannel/DeleteUserChannel";
import { PrefixedRoute } from "../../../PrefixedRoute";

export class ServerGroup extends PrefixedRoute implements Route
{

    constructor(private readonly app: Express, private readonly bot: Bot)
    {
        super();
    }

    register(): this
    {
        new CreateUserChannel(this.app, this.bot).setPrefix(this.prefix).register();
        new CreateUserSubChannel(this.app, this.bot).setPrefix(this.prefix).register();
        new DeleteUserChannel(this.app, this.bot).setPrefix(this.prefix).register();

        return this;
    }
    
}