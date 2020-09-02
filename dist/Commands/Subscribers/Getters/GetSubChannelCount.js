"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const Library_1 = require("../../../Lib/Library");
const SharedRules_1 = require("../../../Validation/SharedRules");
const Error_1 = require("../../../Bot/Error");
const ChannelUtils_1 = require("../../../Bot/Utils/ChannelUtils");
class GetSubChannelCountSubscriber {
    constructor(manager) {
        this.manager = manager;
        this.subject = 'bot.server.*.channel.sub.count';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.schema = joi_1.default.object(SharedRules_1.channelId);
        this.bot = manager.bot;
    }
    getServerIdPosition() {
        return this.serverIdPos;
    }
    getSubject() {
        return this.subject;
    }
    getValidationSchema() {
        return this.schema;
    }
    async handle(msg) {
        if (!this.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
        const channels = await this.bot.getServer().channelList();
        const count = ChannelUtils_1.ChannelUtils.getAllSubchannels(msg.data.channelId, channels).length;
        return Library_1.right(count);
    }
}
exports.GetSubChannelCountSubscriber = GetSubChannelCountSubscriber;
//# sourceMappingURL=GetSubChannelCount.js.map