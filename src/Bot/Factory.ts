import { TeamSpeak, QueryProtocol } from 'ts3-nodejs-library';
import { Configuration } from './Configuration';
import { ConnectionProtocol } from './ConnectionProtocol';
import { Bot } from './Bot';
import { EventHandler } from './EventHandler';

export class Factory
{
    constructor(public connectionConfiguration: Configuration)
    {

    }

    async create(): Promise<Bot>
    {
        const protocol = this.connectionConfiguration.protocol === ConnectionProtocol.ssh ? QueryProtocol.SSH : QueryProtocol.RAW;

        const ts3server = await TeamSpeak.connect({
            host: this.connectionConfiguration.host,
            queryport: this.connectionConfiguration.queryport,
            serverport: this.connectionConfiguration.serverport,
            nickname: this.connectionConfiguration.nickname,
            username: this.connectionConfiguration.username,
            password: this.connectionConfiguration.password,
            protocol,
        });

        new EventHandler(ts3server);

        return new Bot(ts3server);
    }
}