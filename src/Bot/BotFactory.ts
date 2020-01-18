import { TeamSpeak, QueryProtocol } from 'ts3-nodejs-library';
import { BotConfiguration } from './BotConfiguration';
import { ConnectionProtocol } from './ConnectionProtocol';
import { Bot } from './Bot';
import { BotEventHandler } from './BotEventHandler';

export class BotFactory
{
    constructor(public connectionConfiguration: BotConfiguration)
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

        new BotEventHandler(ts3server);

        return new Bot(ts3server);
    }
}