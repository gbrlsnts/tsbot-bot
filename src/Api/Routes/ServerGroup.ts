import { Route } from "../ApiTypes";
import { Express } from "express";
import { Bot } from "../../Bot/Bot";
import { CreateUserChannel } from "./Server/CreateUserChannel";

export class ServerGroup implements Route {
    constructor(private readonly app: Express, private readonly bot: Bot)
    {

    }

    register(): void {
        new CreateUserChannel(this.app, this.bot).register();
    }
    
}