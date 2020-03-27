import { Bot } from "../Bot";
import { BotEventName } from "./BotEvent";
import { ChannelInactiveNotifyHandler } from "./Handler/ChannelInactiveNotifyHandler";
import { ChannelInactiveDeleteHandler } from "./Handler/ChannelInactiveDeleteHandler";
import { EventHandlerInterface } from "./EventHandlerInterface";
import { ChannelNotInactiveHandler } from "./Handler/ChannelNotInactiveHandler";
import Logger from "../../Log/Logger";

export class MasterEventHandler
{
    constructor(private readonly logger: Logger, private readonly bot: Bot)
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
          .catch(error => this.logger.error('Error registering server event', { error }));
    }

    private registerBotEvents()
    {
        const botEvents = this.bot.getBotEvents();

        botEvents.on(BotEventName.channelNotInactiveNotifyEvent, (event) => {
            this.handleBotEvent(new ChannelNotInactiveHandler(this.logger, this.bot, event));
        });

        botEvents.on(BotEventName.channelInactiveNotifyEvent, event => {
            this.handleBotEvent(new ChannelInactiveNotifyHandler(this.logger, this.bot, event));
        });

        botEvents.on(BotEventName.channelInactiveDeleteEvent, event => {
            this.handleBotEvent(new ChannelInactiveDeleteHandler(this.logger, event));
        });
    }

    private handleBotEvent(event: EventHandlerInterface)
    {
        event.handle()
            .catch(error => this.logger.error('Error handling event', { error }));
    }
}