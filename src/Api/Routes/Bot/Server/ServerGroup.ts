import { Express } from "express";
import { Route } from "../../../ApiTypes";
import { Bot } from "../../../../Bot/Bot";
import { CreateUserChannel } from "./UserChannel/CreateUserChannel";
import { CreateUserSubChannel } from "./UserChannel/CreateUserSubChannel";
import { DeleteUserChannel } from "./UserChannel/DeleteUserChannel";
import { PrefixedRoute } from "../../../PrefixedRoute";
import GetClientList from "./Getters/AllInfo";
import VerifyUser from "./VerifyUser/VerifyUser";
import IconUpload from "./Icon/IconUpload";
import IconDelete from "./Icon/IconDelete";
import SetUserGroups from "./UserGroups/SetUserGroups";
import Logger from "../../../../Log/Logger";

export class ServerGroup extends PrefixedRoute implements Route
{

    constructor(private readonly app: Express, private readonly bot: Bot, private readonly logger: Logger)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): this
    {
        const routes: Route[] = [
            new CreateUserChannel(this.app, this.bot, this.logger),
            new CreateUserSubChannel(this.app, this.bot, this.logger),
            new DeleteUserChannel(this.app, this.bot, this.logger),
            new GetClientList(this.app, this.bot, this.logger),
            new VerifyUser(this.app, this.bot, this.logger),
            new IconUpload(this.app, this.bot, this.logger),
            new IconDelete(this.app, this.bot, this.logger),
            new SetUserGroups(this.app, this.bot, this.logger),
        ];

        routes.forEach(route => route.setPrefix(this.prefix).register());

        return this;
    }
    
}