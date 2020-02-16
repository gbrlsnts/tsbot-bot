import express from "express";
import * as bodyParser from "body-parser";
import { CreateUserChannelAction } from "../Bot/Action/CreateUserChannel/CreateUserChannelAction";
import { Bot } from "../Bot/Bot";
import { ServerGroup } from "./Routes/ServerGroup";

export class Api
{
    private readonly app: express.Express;

    constructor(private bot: Bot)
    {
        this.app = express();
        
    }

    boot()
    {
        this.app.use(bodyParser.json());

        this.registerRoutes();
        
        this.app.listen(3000, () => console.log('Api waiting for requests...'));
    }

    private registerRoutes()
    {
        this.app.get('/', (req, res) => {
            res.send('awesome-teamspeak bot');
        });
        
        new ServerGroup(this.app, this.bot).register();
    }
}