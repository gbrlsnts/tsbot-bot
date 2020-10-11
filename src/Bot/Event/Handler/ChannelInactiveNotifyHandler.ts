import { EventHandlerInterface } from '../EventHandlerInterface';
import { Bot } from '../../Bot';
import { ChannelInactiveNotifyEvent } from '../EventTypes';
import { RepositoryInterface } from '../../Repository/RepositoryInterface';
import Logger from '../../../Log/Logger';

export class ChannelInactiveNotifyHandler implements EventHandlerInterface {
    constructor(
        private readonly logger: Logger,
        private readonly bot: Bot,
        private readonly repository: RepositoryInterface,
        private readonly event: ChannelInactiveNotifyEvent
    ) {}

    async handle(): Promise<void> {
        if (!this.event.icon) return;

        const channel = await this.repository.getChannelById(
            this.bot.serverId,
            this.event.channelId
        );

        if (channel.isNotified) return;

        await this.bot.setChannelIcon(this.event.channelId, this.event.icon);
        await this.repository.setChannelNotified(
            this.bot.serverId,
            this.event.channelId,
            true
        );

        this.logger.info('Crawler notified inative channel', {
            canShare: true,
            context: { channelId: this.event.channelId },
        });
    }
}
