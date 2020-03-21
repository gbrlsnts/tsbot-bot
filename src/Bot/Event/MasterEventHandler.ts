import { Bot } from "../Bot";
import { BotEventName } from "./BotEvent";
import { ChannelInactiveNotifyHandler } from "./Handler/ChannelInactiveNotifyHandler";
import { ChannelInactiveDeleteHandler } from "./Handler/ChannelInactiveDeleteHandler";
import { EventHandlerInterface } from "./EventHandlerInterface";
import { ChannelNotInactiveHandler } from "./Handler/ChannelNotInactiveHandler";

export class MasterEventHandler
{
    constructor(private readonly bot: Bot)
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
          ])
          .catch(e => console.error('Error registering server event', e));
    }

    private registerBotEvents()
    {
        const botEvents = this.bot.getBotEvents();

        botEvents.on(BotEventName.channelNotInactiveNotifyEvent, (event) => {
            this.handleBotEvent(new ChannelNotInactiveHandler(this.bot, event));
        });

        botEvents.on(BotEventName.channelInactiveNotifyEvent, event => {
            this.handleBotEvent(new ChannelInactiveNotifyHandler(this.bot, event));
        });

        botEvents.on(BotEventName.channelInactiveDeleteEvent, event => {
            this.handleBotEvent(new ChannelInactiveDeleteHandler(event));
        });
    }

    private handleBotEvent(event: EventHandlerInterface)
    {
        event.handle()
            .catch(e => console.log('Error handling event:', e));
    }
}