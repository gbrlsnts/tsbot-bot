import { QueryProtocol } from 'ts3-nodejs-library';
import { ConnectionProtocol } from './Types';
import { Bot } from './Bot';
import { MasterEventHandler } from './Event/MasterEventHandler';
import { Crawler } from './Crawler/Crawler';
import Manager from './Manager';
import { LoaderInterface } from './Configuration/LoaderInterface';

export default class Factory
{
    constructor(private readonly configLoader: LoaderInterface)
    {

    }

    async create(serverName: string): Promise<Manager>
    {
        const config = await this.configLoader.loadConfiguration(serverName);

        const bot = await Bot.initialize(serverName, {
            ...config.connection,
            protocol: config.connection.protocol === ConnectionProtocol.RAW ? QueryProtocol.RAW : QueryProtocol.SSH,
        });

        const eventHandler = new MasterEventHandler(bot);

        let crawler: Crawler | undefined;        
        if(config.crawler) {
            crawler = new Crawler(bot, config.crawler);
            crawler.boot();
        }

        return new Manager({
            bot,
            eventHandler,
            crawler,
        });
    }
}