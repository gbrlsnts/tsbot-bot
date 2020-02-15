import { Bot } from "../Bot";
import { BotEventName } from "./BotEvent";
import { ChannelInactiveNotifyHandler } from "./Handler/ChannelInactiveNotifyHandler";
import { ChannelInactiveDeleteHandler } from "./Handler/ChannelInactiveDeleteHandler";
import { EventHandlerInterface } from "./EventHandlerInterface";
import { AwilixContainer } from "awilix";
import { Configuration } from "../Configuration/Configuration";
import { ChannelNotInactiveHandler } from "./Handler/ChannelNotInactiveHandler";

export class MasterEventHandler
{
    private readonly bot: Bot;

    constructor(private readonly container: AwilixContainer)
    {
        this.bot = container.resolve('bot');
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

        botEvents.on(BotEventName.channelNotInactiveNotifyEvent, (event) => {
            this.handleBotEvent(new ChannelNotInactiveHandler(this.bot, event));
        });

        botEvents.on(BotEventName.channelInactiveNotifyEvent, event => {
            this.handleBotEvent(new ChannelInactiveNotifyHandler(this.bot, event));
        });

        botEvents.on(BotEventName.channelInactiveDeleteEvent, event => {
            const config = this.container.resolve<Configuration>('config').crawler;

            if(!config)
                return;

            this.handleBotEvent(new ChannelInactiveDeleteHandler(
                this.bot,
                config,
                event
            ));
        });
    }

    private handleBotEvent(event: EventHandlerInterface)
    {
        event.handle()
            .catch(e => console.log('Error handling event:', e));
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