import { Express } from "express";
import { ServerGroup } from "./Server/ServerGroup";
import { Route } from "../../ApiTypes";
import { PrefixedRoute } from "../../PrefixedRoute";
import { CrawlerGroup } from "./Crawler/CrawlerGroup";
import Manager from "../../../Bot/Manager";


export default class BotGroup extends PrefixedRoute implements Route
{
    
    constructor(private readonly app: Express, private readonly manager: Manager)
    {
        super();
    }

    register(): this
    {
        const groups: Route[] = [
            new ServerGroup(this.app, this.manager.bot).setPrefix(this.getWithPrefix('/server')),
            new CrawlerGroup(this.app, this.manager).setPrefix(this.getWithPrefix('/crawler')),
        ];

        groups.forEach(group => group.register());

        return this;
    }
}