import { TeamSpeak, QueryProtocol } from 'ts3-nodejs-library';
import { ConnectionProtocol } from './ConnectionProtocol';
import { Bot } from './Bot';
import { EventHandler } from './EventHandler';
import { Context } from './Context';
import { LocalLoader } from './Configuration/LocalLoader';
import { resolve as pathResolve } from 'path';
import { LocalRepository } from '../Repository/LocalRepository';
import { Crawler } from './Crawler/Crawler';

export class Factory
{
    async create(server: string): Promise<Bot>
    {
        const configLoader = new LocalLoader(pathResolve('server_configs'));
        const configuration = await configLoader.loadConfiguration(server);

        const ts3server = await TeamSpeak.connect({
            host: configuration.connection.host,
            queryport: configuration.connection.queryport,
            serverport: configuration.connection.serverport,
            nickname: configuration.connection.nickname,
            username: configuration.connection.username,
            password: configuration.connection.password,
            protocol: configuration.connection.protocol === ConnectionProtocol.SSH 
                ? QueryProtocol.SSH : QueryProtocol.RAW,
        });

        const whoami = await ts3server.whoami();

        const context = new Context(
            whoami.client_database_id,
            whoami.client_id,
            whoami.client_unique_identifier,
            whoami.virtualserver_id,
            whoami.virtualserver_unique_identifier
        );

        const eventHandler = new EventHandler(ts3server);
        const bot =  new Bot(ts3server, context, eventHandler);

        if(configuration.crawler) {
            new Crawler(bot, this.getRepository(), configuration.crawler).boot();
        }

        return bot;
    }

    private getRepository()
    {
        return new LocalRepository();
    }
}