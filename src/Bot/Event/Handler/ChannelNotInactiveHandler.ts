import { EventHandlerInterface } from "../EventHandlerInterface";
import { Bot } from "../../Bot";
import { ChannelEvent } from "../EventTypes";
import Logger from "../../../Log/Logger";

export class ChannelNotInactiveHandler implements EventHandlerInterface
{
    constructor(private readonly logger: Logger, private readonly bot: Bot, private readonly event: ChannelEvent)
    {

    }

    async handle(): Promise<void> {
        await this.bot.removeChannelIcon(this.event.channelId);

        this.logger.info('Crawler removed inactive channel notify icon', {
            canShare: true,
            context: { channelId: this.event.channelId }
        });
    }
}