import express from "express";
import * as bodyParser from "body-parser";
import { Bot } from "../Bot/Bot";
import { ServerGroup } from "./Routes/Bot/Server/ServerGroup";
import { BotGroup } from "./Routes/Bot/BotGroup";

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
        
        new BotGroup(this.app, this.bot).setPrefix('/bot').register();
    }
}