import { TeamSpeak, TextMessageTargetMode } from "ts3-nodejs-library";
import { Context } from "./Context";
import { EventHandler } from "./EventHandler";

export class Bot
{
    constructor(private server: TeamSpeak, private context: Context, private eventHandler: EventHandler)
    {

    }

    getContext(): Context
    {
        return this.context;
    }

    getEventHandler(): EventHandler
    {
        return this.eventHandler;
    }

    async whoami()
    {
        return await this.server.whoami();
    }

    async sendServerMessage(message: string)
    {
        try {
            await this.server.sendTextMessage(
                0,
                TextMessageTargetMode.SERVER,
                message
            );
        } catch(error) {
            console.log('Got error', error);
        }
    }

    async createChannel(name: string, password?: string)
    {
        return await this.server.channelCreate(name, {
            channel_password: password,
            channel_flag_permanent: 1
        });
    }
}