import { Express } from "express";
import { Bot } from "../../../Bot/Bot";
import { ServerGroup } from "./Server/ServerGroup";
import { Route } from "../../ApiTypes";
import { PrefixedRoute } from "../../PrefixedRoute";


export class BotGroup extends PrefixedRoute implements Route
{
    
    constructor(private readonly app: Express, private readonly bot: Bot)
    {
        super();
    }

    register(): this
    {
        new ServerGroup(this.app, this.bot).setPrefix(this.getWithPrefix('/server')).register();

        return this;
    }
}