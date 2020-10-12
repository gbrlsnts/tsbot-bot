import { Bot } from '../Bot';
import { BotEventName } from './BotEvent';
import { ChannelInactiveNotifyHandler } from './Handler/ChannelInactiveNotifyHandler';
import { ChannelInactiveDeleteHandler } from './Handler/ChannelInactiveDeleteHandler';
import { EventHandlerInterface } from './EventHandlerInterface';
import { ChannelNotInactiveHandler } from './Handler/ChannelNotInactiveHandler';
import { RepositoryInterface } from '../Repository/RepositoryInterface';
import { NatsConnector } from '../../Commands/Nats/Connector';
import Logger from '../../Log/Logger';
import { BotConnectionLostHandler } from './Handler/BotConnectionLostHandler';

export class MasterEventHandler {
    constructor(
        private readonly logger: Logger,
        private readonly bot: Bot,
        private readonly repository: RepositoryInterface,
        private readonly nats: NatsConnector
    ) {
        this.registerServerEvents();
        this.registerBotEvents();
    }

    private registerServerEvents() {
        const server = this.bot.getServer();

        Promise.all([
            server.registerEvent('server'),
            server.registerEvent('channel', 0),
            server.registerEvent('textserver'),
            server.registerEvent('textchannel'),
            server.registerEvent('textprivate'),
        ]).catch(error =>
            this.logger.error('Error registering server event', { error })
        );
    }

    private registerBotEvents() {
        const botEvents = this.bot.getBotEvents();

        botEvents.on(BotEventName.botConnectionLost, () =>
            this.handleBotEvent(
                new BotConnectionLostHandler(
                    this.bot.serverId,
                    this.logger,
                    this.nats
                )
            )
        );

        botEvents.on(BotEventName.channelNotInactiveNotifyEvent, event => {
            this.handleBotEvent(
                new ChannelNotInactiveHandler(this.logger, this.bot, event)
            );
        });

        botEvents.on(BotEventName.channelInactiveNotifyEvent, event => {
            this.handleBotEvent(
                new ChannelInactiveNotifyHandler(
                    this.logger,
                    this.bot,
                    this.repository,
                    event
                )
            );
        });

        botEvents.on(BotEventName.channelInactiveDeleteEvent, event => {
            this.handleBotEvent(
                new ChannelInactiveDeleteHandler(this.logger, event)
            );
        });
    }

    private handleBotEvent(event: EventHandlerInterface) {
        event
            .handle()
            .catch(error =>
                this.logger.error('Error handling event', { error })
            );
    }
}
