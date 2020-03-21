import express from "express";
import * as bodyParser from "body-parser";
import BotGroup from "./Routes/Bot/BotGroup";
import Manager from "../Bot/Manager";

export class Api
{
    private readonly app: express.Express;

    constructor(private manager: Manager)
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
        
        new BotGroup(this.app, this.manager).setPrefix('/bot').register();
    }
}