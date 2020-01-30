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
const randomstring_1 = require("randomstring");
const CreateUserChannelActionResult_1 = require("./CreateUserChannelActionResult");
const ChannelUtils_1 = require("../../Utils/ChannelUtils");
class CreateUserChannelAction {
    constructor(bot, data) {
        this.bot = bot;
        this.data = data;
        this.spacerFormat = '[*spacer%d]=';
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const channels = yield this.createChannelsHierarchy();
            this.setUserChannelAdminGroup(channels);
            return new CreateUserChannelActionResult_1.CreateUserChannelActionResult(channels);
        });
    }
    /**
     * Find the channel where the new channel will be placed after
     */
    getChannelToCreateAfter() {
        return __awaiter(this, void 0, void 0, function* () {
            const channelList = yield this.bot.getServer().channelList();
            const startChannel = channelList.find(c => c.cid === this.data.userChannelStart);
            const channelsInZone = ChannelUtils_1.ChannelUtils.getTopChannelsBetween(channelList, this.data.userChannelStart, this.data.userChannelEnd);
            if (!channelsInZone.hasStart || !channelsInZone.hasEnd)
                throw new Error('Start or End delimiter channels don\'t exist');
            if (!startChannel && channelsInZone.channels.length === 0)
                throw new Error('Unable to determine channel to create new channel after it');
            // In practice will never go through due to the previous statement, but typescript hint won't detect it
            if (!startChannel)
                throw new Error('Unable to find start channel');
            return channelsInZone.channels.pop() || startChannel;
        });
    }
    createChannelsHierarchy() {
        return __awaiter(this, void 0, void 0, function* () {
            let spacer = null, channels = [];
            try {
                const spacerName = this.getSpacerName();
                let channelBefore = yield this.getChannelToCreateAfter();
                if (channelBefore.cid !== this.data.userChannelStart) {
                    spacer = yield this.bot.createSpacer(spacerName, channelBefore.cid);
                    channelBefore = spacer;
                }
                for (let createChannelData of this.data.channels) {
                    const channel = yield this.bot.createChannel(createChannelData.name, createChannelData.password, undefined, channelBefore.cid);
                    channels.push(channel);
                    channelBefore = channel;
                    for (let createSubChannelData of createChannelData.channels) {
                        const subChannel = yield this.bot.createChannel(createSubChannelData.name, createSubChannelData.password, channel.cid);
                        channels.push(subChannel);
                    }
                }
            }
            catch (e) {
                const toDelete = channels;
                if (spacer != null)
                    toDelete.push(spacer);
                this.cleanUpCreatedChannels(toDelete);
                return Promise.reject(new Error(`Error while creating channels: ${e.message}`));
            }
            return channels;
        });
    }
    setUserChannelAdminGroup(channels) {
        const owner = this.data.owner, group = this.data.channelGroupToAssign;
        if (!owner || !group) {
            return;
        }
        channels.forEach(channel => {
            this.bot.setChannelGroupToClient(owner, channel.cid, group)
                .catch(e => console.log('Warning! Could not set channel group of id ' + group));
        });
    }
    getSpacerName() {
        return this.spacerFormat.replace('%d', randomstring_1.generate(6));
    }
    cleanUpCreatedChannels(channels) {
        try {
            channels.forEach(c => this.bot.deleteChannel(c.cid, true));
        }
        catch (e) {
            console.log(`Error cleaning up channels: ${e.message}`);
        }
    }
}
exports.CreateUserChannelAction = CreateUserChannelAction;
//# sourceMappingURL=CreateUserChannelAction.js.map