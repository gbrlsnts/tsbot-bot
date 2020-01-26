import { TeamSpeak, QueryProtocol } from 'ts3-nodejs-library';
import { ConnectionProtocol } from './ConnectionProtocol';
import { Bot } from './Bot';
import { EventHandler } from './EventHandler';
import { Context } from './Context';
import { LocalLoader } from '../Configuration/LocalLoader';
import { resolve as pathResolve } from 'path';

export class Factory
{
    async create(serverId: string): Promise<Bot>
    {
        const configLoader = new LocalLoader(pathResolve('server_configs'));
        const configuration = await configLoader.loadConfiguration(serverId);

        const protocol = configuration.protocol === ConnectionProtocol.SSH ? QueryProtocol.SSH : QueryProtocol.RAW;

        const ts3server = await TeamSpeak.connect({
            host: configuration.host,
            queryport: configuration.queryport,
            serverport: configuration.serverport,
            nickname: configuration.nickname,
            username: configuration.username,
            password: configuration.password,
            protocol,
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

        return new Bot(ts3server, context, eventHandler);
    }
}