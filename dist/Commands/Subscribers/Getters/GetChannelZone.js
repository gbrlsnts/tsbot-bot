"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const Library_1 = require("../../../Lib/Library");
const UserChannelValidationRules_1 = require("../../../Validation/UserChannel/UserChannelValidationRules");
const Error_1 = require("../../../Bot/Error");
const ChannelUtils_1 = require("../../../Bot/Utils/ChannelUtils");
class GetChannelZoneSubscriber {
    constructor(manager) {
        this.manager = manager;
        this.subject = 'bot.server.*.channel.get-zone';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.schema = joi_1.default.object(UserChannelValidationRules_1.getZoneRequest);
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
        const channelList = await this.bot.getServer().channelList();
        for (const zone of msg.data.zones) {
            const inZone = ChannelUtils_1.ChannelUtils.getZoneTopChannels(channelList, zone.start, zone.end, zone.separators).applyOnRight(result => this.isInZone(msg.data.channelId, result.channels));
            if (inZone.isLeft())
                continue;
            if (inZone.value)
                return Library_1.right(zone.id);
        }
        return Library_1.right(undefined);
    }
    isInZone(channelId, channelList) {
        return channelList.findIndex(c => c.cid === channelId) >= 0;
    }
}
exports.GetChannelZoneSubscriber = GetChannelZoneSubscriber;
//# sourceMappingURL=GetChannelZone.js.map