import { EventHandlerInterface } from "../EventHandlerInterface";
import { Bot } from "../../Bot";
import { ChannelEvent } from "../EventTypes";

export class ChannelNotInactiveHandler implements EventHandlerInterface
{
    constructor(private readonly bot: Bot, private readonly event: ChannelEvent)
    {

    }

    async handle(): Promise<void> {
        await this.bot.removeChannelIcon(this.event.channelId);
    }
}