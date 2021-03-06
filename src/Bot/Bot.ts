import config from 'config';
import { TeamSpeak, TextMessageTargetMode } from 'ts3-nodejs-library';
import { BotEvent, BotEventName } from './Event/BotEvent';
import { ChannelPermission, BotCodec } from './Types';
import File from '../Lib/File';
import Logger from '../Log/Logger';

const reconnectConfig: any = config.get('bot.reconnect');

export class Bot {
    private _isConnected = true;
    private readonly botEvents: BotEvent;

    constructor(
        private readonly logger: Logger,
        private readonly server: TeamSpeak,
        readonly serverId: number,
        readonly name: string
    ) {
        this.botEvents = new BotEvent();

        this.setupConnectionLostHandler(
            process.env.RECONNECT_ATTEMPTS || reconnectConfig.attempts,
            process.env.RECONNECT_WAITMS || reconnectConfig.waitMs
        );
    }

    /**
     * Get the server instance
     */
    getServer(): TeamSpeak {
        return this.server;
    }

    /**
     * Get the bot events
     */
    getBotEvents(): BotEvent {
        return this.botEvents;
    }

    /**
     * Setup the handler to reconnect after losing connection to the server
     * @param attempts Attempts before exiting. -1 for infinite
     * @param waitMs Time to wait between retries
     */
    private setupConnectionLostHandler(attempts: number, waitMs: number) {
        this.server.on('close', async () => {
            this.logger.info(`Disconnected from server, retrying`, {
                canShare: true,
            });
            this._isConnected = false;

            this.server
                .reconnect(attempts, waitMs)
                .then(() => (this._isConnected = true))
                .then(() =>
                    this.logger.info(`Reconnected to server`, {
                        canShare: true,
                    })
                )
                .catch(e => {
                    this.botEvents.emit(BotEventName.botConnectionLost);
                    this.logger.error('Error while reconnecting', e);
                });
        });
    }

    /**
     * Get the bot connection status
     */
    get isConnected(): boolean {
        return this._isConnected;
    }

    async getChannelById(channelId: number) {
        return this.server.getChannelByID(channelId);
    }

    async getClientByDatabaseId(clientDatabaseId: number) {
        return this.server.getClientByDBID(clientDatabaseId);
    }

    async sendServerMessage(message: string) {
        return this.server.sendTextMessage(
            0,
            TextMessageTargetMode.SERVER,
            message
        );
    }

    async sendChannelMessage(channelId: number, message: string) {
        return this.server.sendTextMessage(
            channelId,
            TextMessageTargetMode.CHANNEL,
            message
        );
    }

    async sendClientMessage(clientId: number, message: string) {
        return this.server.sendTextMessage(
            clientId,
            TextMessageTargetMode.CLIENT,
            message
        );
    }

    createChannel({
        name,
        password,
        parent,
        afterChannel,
        codec,
        codec_quality,
    }: CreateChannelProperties) {
        let serverCodec;

        switch (codec) {
            case BotCodec.voice:
                serverCodec = 4;
                break;
            case BotCodec.music:
                serverCodec = 5;
                break;
        }

        return this.server.channelCreate(name, {
            channel_password: password,
            channel_flag_permanent: 1,
            channel_order: afterChannel,
            cpid: parent,
            channel_codec: serverCodec,
            channel_codec_quality: codec_quality,
        });
    }

    createSpacer(name: string, afterChannel?: number) {
        return this.server.channelCreate(name, {
            channel_maxclients: 0,
            channel_codec_quality: 0,
            channel_flag_permanent: 1,
            channel_order: afterChannel,
        });
    }

    async deleteChannel(channelId: number, force: boolean = false) {
        return await this.server.channelDelete(channelId, force ? 1 : 0);
    }

    async setChannelGroupToClient(
        databaseId: number,
        channelId: number,
        groupId: number
    ) {
        const group = await this.server.getChannelGroupByID(groupId);

        if (!group)
            throw new Error('Could not find channel group with id ' + groupId);

        return await group.setClient(channelId, databaseId);
    }

    getClientsByAddress(address: string) {
        return this.server.clientList({
            client_type: 0,
            connection_client_ip: address,
        });
    }

    async getClientByDbid(databaseId: number) {
        return await this.server.getClientByDBID(databaseId);
    }

    async setChannelIcon(channelId: number, iconId: number) {
        return await this.server.channelSetPerm(channelId, 'i_icon_id', iconId);
    }

    async removeChannelIcon(channelId: number) {
        return await this.setChannelIcon(channelId, 0);
    }

    async setChannelPermissions(
        channelId: number,
        permissions: ChannelPermission[]
    ): Promise<void> {
        if (!permissions || permissions.length == 0) return;

        await this.server.channelSetPerms(
            channelId,
            permissions.map(perm => {
                return {
                    permsid: perm.permission,
                    permvalue: perm.value,
                };
            })
        );
    }

    async getAllIcons() {
        return this.server.ftGetFileList(0, '/icons', '');
    }

    async getAllIconIds(): Promise<number[]> {
        const icons = await this.getAllIcons();

        return icons
            .filter(i => i.type === 1)
            .map(i => Number(i.name.replace('icon_', '')));
    }

    async downloadIcon(iconId: number) {
        return this.server.downloadIcon(`icon_${iconId}`);
    }

    async uploadIcon(data: Buffer): Promise<number> {
        const iconId = File.calculateNumberChecksum(data);

        await this.server.uploadFile(`/icon_${iconId}`, data);

        return iconId;
    }

    async deleteIcon(iconId: number) {
        return this.server.ftDeleteFile(0, `/icon_${iconId}`, '');
    }

    async clientAddServerGroups(clientDatabaseId: number, groups: number[]) {
        if (groups.length === 0) return;

        return this.server.clientAddServerGroup(clientDatabaseId, groups);
    }

    async clientRemoveServerGroups(clientDatabaseId: number, groups: number[]) {
        if (groups.length === 0) return;

        return this.server.clientDelServerGroup(clientDatabaseId, groups);
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
