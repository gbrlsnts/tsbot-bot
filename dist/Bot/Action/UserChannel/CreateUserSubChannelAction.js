"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("../../Error");
const Library_1 = require("../../../Lib/Library");
const CreateChannelAction_1 = require("./CreateChannelAction");
class CreateUserSubChannelAction extends CreateChannelAction_1.CreateChannelAction {
    constructor(bot, data) {
        super(bot);
        this.data = data;
    }
    /**
     * Create the user sub channel
     */
    async execute() {
        if (!this.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
        const failure = await this.validateAction(this.data.channelId) || await this.validateChannel(this.data.channelId);
        if (failure)
            return Library_1.left(failure);
        await this.createSubChannel();
        this.setUserChannelAdminGroup(this.getCreatedChannels());
        return Library_1.right({
            channels: this.getCreatedChannels().map(channel => channel.cid)
        });
    }
    /**
     * Create sub channels in the request
     */
    async createSubChannel() {
        try {
            for (const config of this.data.channels) {
                await this.createUserChannel({ config, parent: this.data.channelId });
            }
        }
        catch (e) {
            this.cleanUpCreatedChannels(this.getCreatedChannels());
            return Promise.reject(new Error(`Error while creating channels: ${e.message}`));
        }
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
exports.CreateUserSubChannelAction = CreateUserSubChannelAction;
//# sourceMappingURL=CreateUserSubChannelAction.js.map