import { EventHandlerInterface } from "../EventHandlerInterface";
import { Bot } from "../../Bot";
import { ChannelInactiveDeleteEvent } from "../EventTypes";

export class ChannelInactiveDeleteHandler implements EventHandlerInterface
{
    constructor(private readonly bot: Bot, private readonly event: ChannelInactiveDeleteEvent)
    {

    }

    async handle(): Promise<void> {
        const channel = await this.bot.getServer().getChannelByID(this.event.channelId);

        if(!channel)
            return;

        // todo: need to delete spacer separator if there's only one channel
        this.bot.deleteChannel(channel.cid);
    }
}