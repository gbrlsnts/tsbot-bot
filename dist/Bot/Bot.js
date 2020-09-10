"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
const SelfInfo_1 = __importDefault(require("./SelfInfo"));
const BotEvent_1 = require("./Event/BotEvent");
const Types_1 = require("./Types");
const File_1 = __importDefault(require("../Lib/File"));
class Bot {
    constructor(logger, server, self, name) {
        this.logger = logger;
        this.server = server;
        this.self = self;
        this.name = name;
        this._isConnected = true;
        this.botEvents = new BotEvent_1.BotEvent();
        this.setupConnectionLostHandler(-1, 1000);
    }
    /**
     * Initialize the bot
     * @param logger The logger instance
     * @param server The Teamspeak server instance
     * @param name Configuration name
     */
    static async initialize(logger, name, config) {
        const ts3server = await ts3_nodejs_library_1.TeamSpeak.connect(config);
        const self = await SelfInfo_1.default.initialize(ts3server);
        return new Bot(logger, ts3server, self, name);
    }
    /**
     * Get the server instance
     */
    getServer() {
        return this.server;
    }
    /**
     * Get the bot events
     */
    getBotEvents() {
        return this.botEvents;
    }
    /**
     * Setup the handler to reconnect after losing connection to the server
     * @param attempts Attempts before exiting. -1 for infinite
     * @param waitMs Time to wait between retries
     */
    setupConnectionLostHandler(attempts, waitMs) {
        this.server.on('close', async () => {
            this.logger.info(`Disconnected from server, retrying`, {
                canShare: true,
            });
            this._isConnected = false;
            this.server
                .reconnect(attempts, waitMs)
                .then(() => this.self.issueRefresh())
                .then(() => (this._isConnected = true))
                .then(() => this.logger.info(`Reconnected to server`, {
                canShare: true,
            }))
                .catch(e => this.logger.error('Error while reconnecting', e));
        });
    }
    /**
     * Get the bot connection status
     */
    get isConnected() {
        return this._isConnected;
    }
    async getChannelById(channelId) {
        return this.server.getChannelByID(channelId);
    }
    async getClientByDatabaseId(clientDatabaseId) {
        return this.server.getClientByDBID(clientDatabaseId);
    }
    async sendServerMessage(message) {
        return this.server.sendTextMessage(0, ts3_nodejs_library_1.TextMessageTargetMode.SERVER, message);
    }
    async sendChannelMessage(channelId, message) {
        return this.server.sendTextMessage(channelId, ts3_nodejs_library_1.TextMessageTargetMode.CHANNEL, message);
    }
    async sendClientMessage(clientId, message) {
        return this.server.sendTextMessage(clientId, ts3_nodejs_library_1.TextMessageTargetMode.CLIENT, message);
    }
    async createChannel({ name, password, parent, afterChannel, codec, codec_quality, }) {
        let serverCodec;
        switch (codec) {
            case Types_1.BotCodec.voice:
                serverCodec = 4;
                break;
            case Types_1.BotCodec.music:
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
    async createSpacer(name, afterChannel) {
        return await this.server.channelCreate(name, {
            channel_maxclients: 0,
            channel_codec_quality: 0,
            channel_flag_permanent: 1,
            channel_order: afterChannel,
        });
    }
    async deleteChannel(channelId, force = false) {
        return await this.server.channelDelete(channelId, force ? 1 : 0);
    }
    async setChannelGroupToClient(databaseId, channelId, groupId) {
        const group = await this.server.getChannelGroupByID(groupId);
        if (!group)
            throw new Error('Could not find channel group with id ' + groupId);
        return await group.setClient(channelId, databaseId);
    }
    async getClientByDbid(databaseId) {
        return await this.server.getClientByDBID(databaseId);
    }
    async setChannelIcon(channelId, iconId) {
        return await this.server.channelSetPerm(channelId, 'i_icon_id', iconId);
    }
    async removeChannelIcon(channelId) {
        return await this.setChannelIcon(channelId, 0);
    }
    async setChannelPermissions(channelId, permissions) {
        return await this.server.channelSetPerms(channelId, permissions.map(perm => {
            return {
                permsid: perm.permission,
                permvalue: perm.value,
            };
        }));
    }
    async getAllIcons() {
        return this.server.ftGetFileList(0, '/icons', '');
    }
    async getAllIconIds() {
        const icons = await this.getAllIcons();
        return icons
            .filter(i => i.type === 1)
            .map(i => Number(i.name.replace('icon_', '')));
    }
    async downloadIcon(iconId) {
        return this.server.downloadIcon(`icon_${iconId}`);
    }
    async uploadIcon(data) {
        const iconId = File_1.default.calculateNumberChecksum(data);
        await this.server.uploadFile(`/icon_${iconId}`, data);
        return iconId;
    }
    async deleteIcon(iconId) {
        return this.server.ftDeleteFile(0, `/icon_${iconId}`, '');
    }
    async clientAddServerGroups(clientDatabaseId, groups) {
        if (groups.length === 0)
            return;
        return this.server.clientAddServerGroup(clientDatabaseId, groups);
    }
    async clientRemoveServerGroups(clientDatabaseId, groups) {
        if (groups.length === 0)
            return;
        return this.server.clientDelServerGroup(clientDatabaseId, groups);
    }
}
exports.Bot = Bot;
//# sourceMappingURL=Bot.js.map