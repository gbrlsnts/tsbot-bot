import { Express } from "express";
import { Route } from "../../../ApiTypes";
import { Bot } from "../../../../Bot/Bot";
import { CreateUserChannel } from "./UserChannel/CreateUserChannel";
import { CreateUserSubChannel } from "./UserChannel/CreateUserSubChannel";
import { DeleteUserChannel } from "./UserChannel/DeleteUserChannel";
import { PrefixedRoute } from "../../../PrefixedRoute";
import GetClientList from "./Getters/GetClientList";
import VerifyUser from "./VerifyUser/VerifyUser";
import IconUpload from "./Icon/IconUpload";
import IconDelete from "./Icon/IconDelete";

export class ServerGroup extends PrefixedRoute implements Route
{

    constructor(private readonly app: Express, private readonly bot: Bot)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): this
    {
        const routes: Route[] = [
            new CreateUserChannel(this.app, this.bot),
            new CreateUserSubChannel(this.app, this.bot),
            new DeleteUserChannel(this.app, this.bot),
            new GetClientList(this.app, this.bot),
            new VerifyUser(this.app, this.bot),
            new IconUpload(this.app, this.bot),
            new IconDelete(this.app, this.bot),
        ];

        routes.forEach(route => route.setPrefix(this.prefix).register());

        return this;
    }
    
}