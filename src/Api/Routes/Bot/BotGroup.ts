import { Express } from "express";
import { ServerGroup } from "./Server/ServerGroup";
import { Route } from "../../ApiTypes";
import { PrefixedRoute } from "../../PrefixedRoute";
import { CrawlerGroup } from "./Crawler/CrawlerGroup";
import Manager from "../../../Bot/Manager";
import Logger from "../../../Log/Logger";


export default class BotGroup extends PrefixedRoute implements Route
{
    
    constructor(private readonly app: Express, private readonly manager: Manager, private readonly logger: Logger)
    {
        super();
    }

    register(): this
    {
        const groups: Route[] = [
            new ServerGroup(this.app, this.manager.bot, this.logger).setPrefix(this.getWithPrefix('/server')),
            new CrawlerGroup(this.app, this.manager, this.logger).setPrefix(this.getWithPrefix('/crawler')),
        ];

        groups.forEach(group => group.register());

        return this;
    }
}