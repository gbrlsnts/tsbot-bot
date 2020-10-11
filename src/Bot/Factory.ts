import { QueryProtocol } from 'ts3-nodejs-library';
import { ConnectionProtocol } from './Types';
import { Bot } from './Bot';
import { MasterEventHandler } from './Event/MasterEventHandler';
import { Crawler } from './Crawler/Crawler';
import Manager from './Manager';
import { LoaderInterface } from './Configuration/LoaderInterface';
import Logger from '../Log/Logger';
import { RepositoryInterface } from './Repository/RepositoryInterface';

export default class Factory {
    constructor(
        private readonly configLoader: LoaderInterface,
        private readonly repository: RepositoryInterface,
        private readonly logger: Logger
    ) {}

    async create(serverName: string): Promise<Manager> {
        const config = await this.configLoader.loadConfiguration(serverName);

        const botLogger = this.logger.scoped({
            server: serverName,
        });

        const bot = await Bot.initialize(botLogger, config.id, serverName, {
            ...config.connection,
            protocol:
                config.connection.protocol === ConnectionProtocol.RAW
                    ? QueryProtocol.RAW
                    : QueryProtocol.SSH,
        });

        const eventHandler = new MasterEventHandler(
            botLogger,
            bot,
            this.repository
        );

        let crawler: Crawler | undefined;
        if (config.crawler) {
            crawler = new Crawler(
                bot,
                botLogger,
                this.repository,
                config.crawler
            );
            crawler.boot();
        }

        return new Manager({
            bot,
            eventHandler,
            crawler,
            logger: botLogger,
            repository: this.repository,
        });
    }
}
