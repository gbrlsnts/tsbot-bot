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
class ValidateChannelsUniqueSubscriber {
    constructor(manager) {
        this.manager = manager;
        this.subject = 'bot.server.*.channel.is-unique';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.schema = joi_1.default.object(SharedRules_1.channelNames);
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
        const { data: { channels, rootChannelId }, } = msg;
        if (!this.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
        if (rootChannelId) {
            const channelList = await this.bot.getServer().channelList();
            return Library_1.right(this.validateSubChannelsUnique(channelList, channels, rootChannelId));
        }
        const channelList = await this.bot.getServer().channelList({
            pid: 0,
        });
        return Library_1.right(this.isNameUnique(channelList, channels));
    }
    validateSubChannelsUnique(channelList, names, rootChannelId) {
        const subChannels = ChannelUtils_1.ChannelUtils.getAllSubchannels(rootChannelId, channelList);
        return this.isNameUnique(subChannels, names);
    }
    isNameUnique(channelList, names) {
        return channelList.every(channel => {
            return !names.includes(channel.name);
        });
    }
}
exports.ValidateChannelsUniqueSubscriber = ValidateChannelsUniqueSubscriber;
//# sourceMappingURL=ValidateChannelUnique.js.map