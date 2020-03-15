import { TeamSpeak, TextMessageTargetMode, Codec } from "ts3-nodejs-library";
import { Context } from "./Context";
import { BotEvent } from "./Event/BotEvent";
import { ChannelPermission, BotCodec } from "./Types";
import File from "../Lib/File";

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

    async getChannelById(channelId: number)
    {
        return this.server.getChannelByID(channelId);
    }

    async sendServerMessage(message: string)
    {
        return this.server.sendTextMessage(
                0,
                TextMessageTargetMode.SERVER,
                message
            );
    }

    async sendChannelMessage(channelId: number, message: string)
    {
        return this.server.sendTextMessage(
                channelId,
                TextMessageTargetMode.CHANNEL,
                message
            );
    }

    async sendClientMessage(clientId: number, message: string)
    {
        return this.server.sendTextMessage(
                clientId,
                TextMessageTargetMode.CLIENT,
                message
            );
    }

    async createChannel({ name, password, parent, afterChannel, codec, codec_quality }: CreateChannelProperties)
    {
        let serverCodec;

        switch(codec) {
            case BotCodec.voice:
                serverCodec = 4;
                break;
            case BotCodec.music:
                serverCodec = 5;
                break;
        }

        return await this.server.channelCreate(name, {
            channel_password: password,
            channel_flag_permanent: 1,
            channel_order: afterChannel,
            cpid: parent,
            channel_codec: serverCodec,
            channel_codec_quality: codec_quality
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

    async setChannelPermissions(channelId: number, permissions: ChannelPermission[])
    {
        return await this.server.channelSetPerms(channelId, permissions.map(perm => {
            return {
                permsid: perm.permission,
                permvalue: perm.value,
            }
        }));
    }

    async uploadIcon(data: Buffer)
    {
        const iconId = File.calculateNumberChecksum(data);

        return this.server.uploadFile(`/icon_${iconId}`, data);
    }

    async deleteIcon(iconId: number)
    {
        return this.server.ftDeleteFile(0, `/icon_${iconId}`, '');
    }
}

export interface CreateChannelProperties {
    name: string;
    password?: string;
    parent?: number;
    afterChannel?: number;
    codec?: BotCodec;
    codec_quality?: number;
}