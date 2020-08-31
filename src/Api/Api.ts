import config from 'config';
import express from 'express';
import pinoExpress from 'express-pino-logger';
import * as bodyParser from 'body-parser';
import BotGroup from './Routes/Bot/BotGroup';
import Manager from '../Bot/Manager';
import Logger from '../Log/Logger';
import { ApiConfig } from './ApiTypes';

const apiConfig = config.get<ApiConfig>('api');

export class Api {
    private readonly app: express.Express;
    readonly port = process.env.API_PORT || apiConfig.port;

    constructor(
        private readonly manager: Manager,
        private readonly globalLogger: Logger
    ) {
        this.app = express();

        this.app.use(
            pinoExpress({
                logger: globalLogger.logger,
            })
        );
    }

    boot() {
        this.app.use(bodyParser.json());

        this.registerRoutes();

        this.app.listen(this.port, () =>
            this.globalLogger.info('Api waiting for requests...')
        );
    }

    private registerRoutes() {
        this.app.get('/', (req, res) => {
            res.send('awesome-teamspeak bot');
        });

        new BotGroup(this.app, this.manager, this.globalLogger)
            .setPrefix('/bot')
            .register();
    }
}
