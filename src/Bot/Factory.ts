import { TeamSpeak, QueryProtocol } from 'ts3-nodejs-library';
import { ConnectionProtocol } from './ConnectionProtocol';
import { Bot } from './Bot';
import { MasterEventHandler } from './Event/MasterEventHandler';
import { Context } from './Context';
import { LocalLoader } from './Configuration/LocalLoader';
import { resolve as pathResolve } from 'path';
import { Crawler } from './Crawler/Crawler';

export class Factory
{
    async create(server: string): Promise<Bot>
    {
        const configLoader = new LocalLoader(pathResolve('server_configs'));
        const configuration = await configLoader.loadConfiguration(server);

        const ts3server = await TeamSpeak.connect({
            ...configuration.connection,
            protocol: configuration.connection.protocol === ConnectionProtocol.RAW ? QueryProtocol.RAW : QueryProtocol.SSH,
        });

        const whoami = await ts3server.whoami();

        const context = new Context(
            whoami.client_database_id,
            whoami.client_id,
            whoami.client_unique_identifier,
            whoami.virtualserver_id,
            whoami.virtualserver_unique_identifier
        );

        const bot =  new Bot(ts3server, context);
        const eventHandler = new MasterEventHandler(bot);

        if(configuration.crawler) {
            new Crawler(bot, configuration.crawler).boot();
        }

        return bot;
    }
}