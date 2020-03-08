"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../../Lib/Library");
const ChannelAction_1 = require("../ChannelAction");
class DeleteUserChannel extends ChannelAction_1.ChannelAction {
    constructor(bot, data) {
        super();
        this.bot = bot;
        this.data = data;
    }
    /**
     * Delete the channel
     */
    async execute() {
        const failure = await this.validateChannel(this.data.channelId);
        if (failure)
            return Library_1.left(failure);
        await this.bot.deleteChannel(this.data.channelId, true);
        return Library_1.right(true);
    }
    /**
     * Get the server bot instance
     */
    getBot() {
        return this.bot;
    }
    /**
     * Get the action data
     */
    getData() {
        return this.data;
    }
}
exports.DeleteUserChannel = DeleteUserChannel;
//# sourceMappingURL=DeleteUserChannel.js.map