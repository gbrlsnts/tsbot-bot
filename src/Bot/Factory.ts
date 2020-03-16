import * as awilix from 'awilix';
import { QueryProtocol } from 'ts3-nodejs-library';
import { ConnectionProtocol } from './Types';
import { Bot } from './Bot';
import { MasterEventHandler } from './Event/MasterEventHandler';
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

        const bot = await Bot.initialize(server, {
            ...configuration.connection,
            protocol: configuration.connection.protocol === ConnectionProtocol.RAW ? QueryProtocol.RAW : QueryProtocol.SSH,
        });

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