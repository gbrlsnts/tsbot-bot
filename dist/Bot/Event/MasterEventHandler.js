"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BotEvent_1 = require("./BotEvent");
const ChannelInactiveNotifyHandler_1 = require("./Handler/ChannelInactiveNotifyHandler");
const ChannelInactiveDeleteHandler_1 = require("./Handler/ChannelInactiveDeleteHandler");
const ChannelNotInactiveHandler_1 = require("./Handler/ChannelNotInactiveHandler");
class MasterEventHandler {
    constructor(logger, bot) {
        this.logger = logger;
        this.bot = bot;
        this.registerServerEvents();
        this.registerBotEvents();
    }
    registerServerEvents() {
        const server = this.bot.getServer();
        Promise.all([
            server.registerEvent("server"),
            server.registerEvent("channel", 0),
            server.registerEvent("textserver"),
            server.registerEvent("textchannel"),
            server.registerEvent("textprivate")
        ])
            .catch(error => this.logger.error('Error registering server event', { error }));
    }
    registerBotEvents() {
        const botEvents = this.bot.getBotEvents();
        botEvents.on(BotEvent_1.BotEventName.channelNotInactiveNotifyEvent, (event) => {
            this.handleBotEvent(new ChannelNotInactiveHandler_1.ChannelNotInactiveHandler(this.logger, this.bot, event));
        });
        botEvents.on(BotEvent_1.BotEventName.channelInactiveNotifyEvent, event => {
            this.handleBotEvent(new ChannelInactiveNotifyHandler_1.ChannelInactiveNotifyHandler(this.logger, this.bot, event));
        });
        botEvents.on(BotEvent_1.BotEventName.channelInactiveDeleteEvent, event => {
            this.handleBotEvent(new ChannelInactiveDeleteHandler_1.ChannelInactiveDeleteHandler(this.logger, event));
        });
    }
    handleBotEvent(event) {
        event.handle()
            .catch(error => this.logger.error('Error handling event', { error }));
    }
}
exports.MasterEventHandler = MasterEventHandler;
//# sourceMappingURL=MasterEventHandler.js.map