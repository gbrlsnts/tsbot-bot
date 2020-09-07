import {
    TeamSpeak,
    TextMessageTargetMode,
    ConnectionParams,
} from 'ts3-nodejs-library';
import SelfInfo from './SelfInfo';
import { BotEvent } from './Event/BotEvent';
import { ChannelPermission, BotCodec } from './Types';
import File from '../Lib/File';
import Logger from '../Log/Logger';

export class Bot {
    private _isConnected = true;
    private readonly botEvents: BotEvent;

    constructor(
        private readonly logger: Logger,
        private readonly server: TeamSpeak,
        readonly self: SelfInfo,
        readonly name: string
    ) {
        this.botEvents = new BotEvent();

        this.setupConnectionLostHandler(-1, 1000);
    }

    /**
     * Initialize the bot
     * @param logger The logger instance
     * @param server The Teamspeak server instance
     * @param name Configuration name
     */
    static async initialize(
        logger: Logger,
        name: string,
        config: Partial<ConnectionParams>
    ): Promise<Bot> {
        const ts3server = await TeamSpeak.connect(config);
        const self = await SelfInfo.initialize(ts3server);

        return new Bot(logger, ts3server, self, name);
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
                .then(() => this.self.issueRefresh())
                .then(() => (this._isConnected = true))
                .then(() =>
                    this.logger.info(`Reconnected to server`, {
                        canShare: true,
                    })
                )
                .catch(e => this.logger.error('Error while reconnecting', e));
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

    async createChannel({
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

        return await this.server.channelCreate(name, {
            channel_password: password,
            channel_flag_permanent: 1,
            channel_order: afterChannel,
            cpid: parent,
            channel_codec: serverCodec,
            channel_codec_quality: codec_quality,
        });
    }

    async createSpacer(name: string, afterChannel?: number) {
        return await this.server.channelCreate(name, {
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
    ) {
        return await this.server.channelSetPerms(
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
        return this.server.ftGetFileList(0, '/icons');
    }

    async downloadIcon(iconId: number) {
        return this.server.downloadIcon(`icon_${iconId}`);
    }

    async uploadIcon(data: Buffer) {
        const iconId = File.calculateNumberChecksum(data);

        return this.server.uploadFile(`/icon_${iconId}`, data);
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
