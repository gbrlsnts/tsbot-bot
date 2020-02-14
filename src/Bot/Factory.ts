import * as awilix from 'awilix';
import { TeamSpeak, QueryProtocol } from 'ts3-nodejs-library';
import { ConnectionProtocol } from './ConnectionProtocol';
import { Bot } from './Bot';
import { MasterEventHandler } from './Event/MasterEventHandler';
import { Context } from './Context';
import { Factory as LoaderFactory } from './Configuration/Factory';
import { Crawler } from './Crawler/Crawler';
import { Configuration } from './Configuration/Configuration';

export class Factory
{
    async create(server: string): Promise<Bot>
    {
        const container = awilix.createContainer({
            injectionMode: "CLASSIC"
        });

        const configuration = await new LoaderFactory().create().loadConfiguration(server);

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

        // todo: improve container registrations
        container.register({
            config: awilix.asValue<Configuration>(configuration),
            bot: awilix.asValue<Bot>(bot)
        });

        const eventHandler = new MasterEventHandler(container);

        if(configuration.crawler) {
            new Crawler(bot, configuration.crawler).boot();
        }

        return bot;
    }
}