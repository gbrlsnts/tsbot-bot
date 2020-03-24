import express from "express";
import pinoExpress from "express-pino-logger";
import * as bodyParser from "body-parser";
import BotGroup from "./Routes/Bot/BotGroup";
import Manager from "../Bot/Manager";
import Logger from "../Log/Logger";

export class Api
{
    private readonly app: express.Express;

    constructor(private readonly manager: Manager, private readonly logger: Logger)
    {
        this.app = express();

        this.app.use(pinoExpress({
            logger: logger.logger
        }));
    }

    boot()
    {
        this.app.use(bodyParser.json());

        this.registerRoutes();
        
        this.app.listen(3000, () => this.logger.info('Api waiting for requests...'));
    }

    private registerRoutes()
    {
        this.app.get('/', (req, res) => {
            res.send('awesome-teamspeak bot');
        });
        
        new BotGroup(this.app, this.manager, this.logger).setPrefix('/bot').register();
    }
}