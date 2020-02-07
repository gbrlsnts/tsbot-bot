import { Bot } from "../Bot";
import { BotEventName } from "./BotEvent";
import { ChannelInactiveNotifyHandler } from "./Handler/ChannelInactiveNotifyHandler";

export class MasterEventHandler
{
    constructor(private bot: Bot)
    {
        this.registerServerEvents();
        this.registerBotEvents();
    }

    private registerServerEvents()
    {
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

    private registerBotEvents()
    {
        const botEvents = this.bot.getBotEvents();

        botEvents.on(BotEventName.channelNotInactiveNotifyEvent, ({ channelId }) => {
            console.log(`Channel ${channelId} not inactive notify`)
        });

        botEvents.on(BotEventName.channelInactiveNotifyEvent, event => {
            new ChannelInactiveNotifyHandler(this.bot, event).handle()
                .catch(e => console.log('Error handling event:', e));
        });

        botEvents.on(BotEventName.channelInactiveDeleteEvent, ({ channelId }) => {
            console.log(`Channel ${channelId} delete event`)
        });
    }

    private registerClientConnectHandler()
    {
        this.bot.getServer().on('clientconnect', event => {
            console.log('Client Connect', event);
        });
    }

    private registerTextMessageHandler()
    {
        this.bot.getServer().on('textmessage', event => {
            console.log('Server Event', event);
        });
    }
}