import { Express } from "express";
import { ApiRoute } from "../../../ApiRoute";
import { Route } from "../../../ApiTypes";
import Manager from "../../../../Bot/Manager";
import { right } from "../../../../Lib/Either";

export default class Disable extends ApiRoute implements Route
{
    constructor(private readonly app: Express, private readonly manager: Manager)
    {
        super();
    }

    /**
     * Register the route
     */
    register(): this {
        this.app.post(this.getWithPrefix('disable'), async (req, res) => {
            this.manager.disableCrawler();
            this.mapToResponse(res, right(true)).send();          
        });

        return this;
    }

}