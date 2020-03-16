"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
const BotEvent_1 = require("./Event/BotEvent");
const Types_1 = require("./Types");
const File_1 = __importDefault(require("../Lib/File"));
class Bot {
    constructor(server, context) {
        this.server = server;
        this.context = context;
        this.botEvents = new BotEvent_1.BotEvent();
    }
    getServer() {
        return this.server;
    }
    getContext() {
        return this.context;
    }
    getBotEvents() {
        return this.botEvents;
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
    async createChannel({ name, password, parent, afterChannel, codec, codec_quality }) {
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
            channel_codec_quality: codec_quality
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
    async uploadIcon(data) {
        const iconId = File_1.default.calculateNumberChecksum(data);
        return this.server.uploadFile(`/icon_${iconId}`, data);
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