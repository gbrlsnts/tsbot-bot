import { Express } from "express";
import { Route } from "../../../ApiTypes";
import { PrefixedRoute } from "../../../PrefixedRoute";
import Manager from "../../../../Bot/Manager";
import SetConfig from "./SetConfig";
import Disable from "./Disable";
import Logger from "../../../../Log/Logger";


export class CrawlerGroup extends PrefixedRoute implements Route
{

    constructor(private readonly app: Express, private readonly manager: Manager, private readonly logger: Logger)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): this
    {
        const routes: Route[] = [
            new SetConfig(this.app, this.manager, this.logger),
            new Disable(this.app, this.manager, this.logger),
        ];

        routes.forEach(route => route.setPrefix(this.prefix).register());

        return this;
    }
    
}