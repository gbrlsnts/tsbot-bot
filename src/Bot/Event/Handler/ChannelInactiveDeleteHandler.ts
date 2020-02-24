import { EventHandlerInterface } from "../EventHandlerInterface";
import { ZoneChannelEvent } from "../EventTypes";

export class ChannelInactiveDeleteHandler implements EventHandlerInterface
{
    constructor(private readonly event: ZoneChannelEvent)
    {

    }

    async handle(): Promise<void>
    {
        console.log('Dummy delete event', this.event.channelId);
    }
}