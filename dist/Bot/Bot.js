"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
class Bot {
    constructor(server, context, eventHandler) {
        this.server = server;
        this.context = context;
        this.eventHandler = eventHandler;
    }
    getServer() {
        return this.server;
    }
    getContext() {
        return this.context;
    }
    getEventHandler() {
        return this.eventHandler;
    }
    sendServerMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.server.sendTextMessage(0, ts3_nodejs_library_1.TextMessageTargetMode.SERVER, message);
            }
            catch (error) {
                console.log('Got error', error);
            }
        });
    }
    createChannel(name, password, parent, afterChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.channelCreate(name, {
                channel_password: password,
                channel_flag_permanent: 1,
                channel_order: afterChannel,
                cpid: parent,
            });
        });
    }
    createSpacer(name, afterChannel) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.channelCreate(name, {
                channel_maxclients: 0,
                channel_codec_quality: 0,
                channel_flag_permanent: 1,
                channel_order: afterChannel,
            });
        });
    }
    deleteChannel(channelId, force) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.channelDelete(channelId, force ? 1 : 0);
        });
    }
    setChannelGroupToClient(databaseId, channelId, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.server.getChannelGroupByID(groupId);
            if (!group)
                throw new Error('Could not find channel group with id ' + groupId);
            return yield group.setClient(channelId, databaseId);
        });
    }
    getClientByDbid(databaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.getClientByDBID(databaseId);
        });
    }
}
exports.Bot = Bot;
//# sourceMappingURL=Bot.js.map