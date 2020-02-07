"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BotEvent_1 = require("./BotEvent");
const ChannelInactiveNotifyHandler_1 = require("./Handler/ChannelInactiveNotifyHandler");
const ChannelInactiveDeleteHandler_1 = require("./Handler/ChannelInactiveDeleteHandler");
class MasterEventHandler {
    constructor(bot) {
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
        ]);
        this.registerClientConnectHandler();
        this.registerTextMessageHandler();
    }
    registerBotEvents() {
        const botEvents = this.bot.getBotEvents();
        botEvents.on(BotEvent_1.BotEventName.channelNotInactiveNotifyEvent, ({ channelId }) => {
            console.log(`Channel ${channelId} not inactive notify`);
        });
        botEvents.on(BotEvent_1.BotEventName.channelInactiveNotifyEvent, event => {
            new ChannelInactiveNotifyHandler_1.ChannelInactiveNotifyHandler(this.bot, event).handle()
                .catch(e => console.log('Error handling event:', e));
        });
        botEvents.on(BotEvent_1.BotEventName.channelInactiveDeleteEvent, event => {
            new ChannelInactiveDeleteHandler_1.ChannelInactiveDeleteHandler(this.bot, event).handle()
                .catch(e => console.log('Error handling event:', e));
        });
    }
    registerClientConnectHandler() {
        this.bot.getServer().on('clientconnect', event => {
            console.log('Client Connect', event);
        });
    }
    registerTextMessageHandler() {
        this.bot.getServer().on('textmessage', event => {
            console.log('Server Event', event);
        });
    }
}
exports.MasterEventHandler = MasterEventHandler;
//# sourceMappingURL=MasterEventHandler.js.map