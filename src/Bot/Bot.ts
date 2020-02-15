import { TeamSpeak, TextMessageTargetMode } from "ts3-nodejs-library";
import { Context } from "./Context";
import { MasterEventHandler } from "./Event/MasterEventHandler";
import { BotEvent } from "./Event/BotEvent";

export class Bot
{
    private readonly botEvents: BotEvent;

    constructor(private server: TeamSpeak, private context: Context)
    {
        this.botEvents = new BotEvent();
    }

    getServer(): TeamSpeak
    {
        return this.server;
    }

    getContext(): Context
    {
        return this.context;
    }

    getBotEvents(): BotEvent
    {
        return this.botEvents;
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

    async createChannel(name: string, password?: string, parent?: number, afterChannel?: number)
    {
        return await this.server.channelCreate(name, {
            channel_password: password,
            channel_flag_permanent: 1,
            channel_order: afterChannel,
            cpid: parent,
        });
    }

    async createSpacer(name: string, afterChannel?: number)
    {
        return await this.server.channelCreate(name, {
            channel_maxclients: 0,
            channel_codec_quality: 0,
            channel_flag_permanent: 1,
            channel_order: afterChannel,
        });
    }

    async deleteChannel(channelId: number, force: boolean = false)
    {
        return await this.server.channelDelete(channelId, force ? 1 : 0);
    }

    async setChannelGroupToClient(databaseId: number, channelId: number, groupId: number)
    {
        const group = await this.server.getChannelGroupByID(groupId);

        if(!group)
            throw new Error('Could not find channel group with id ' + groupId);

        return await group.setClient(channelId, databaseId);
    }

    async getClientByDbid(databaseId: number)
    {
        return await this.server.getClientByDBID(databaseId);
    }

    async setChannelIcon(channelId: number, iconId: number)
    {
        return await this.server.channelSetPerm(channelId, 'i_icon_id', iconId);
    }

    async removeChannelIcon(channelId: number)
    {
        return await this.setChannelIcon(channelId, 0);
    }
}