import { Express } from "express";
import { Route } from "../../../ApiTypes";
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
import Manager from "../../../../Bot/Manager";

export class ServerGroup extends PrefixedRoute implements Route
{

    constructor(private readonly app: Express, private readonly manager: Manager, private readonly globalLogger: Logger)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): this
    {
        const routes: Route[] = [
            new CreateUserChannel(this.app, this.manager, this.globalLogger),
            new CreateUserSubChannel(this.app, this.manager, this.globalLogger),
            new DeleteUserChannel(this.app, this.manager, this.globalLogger),
            new GetClientList(this.app, this.manager.bot, this.globalLogger),
            new VerifyUser(this.app, this.manager.bot, this.globalLogger),
            new IconUpload(this.app, this.manager.bot, this.globalLogger),
            new IconDelete(this.app, this.manager.bot, this.globalLogger),
            new SetUserGroups(this.app, this.manager.bot, this.globalLogger),
        ];

        routes.forEach(route => route.setPrefix(this.prefix).register());

        return this;
    }
    
}