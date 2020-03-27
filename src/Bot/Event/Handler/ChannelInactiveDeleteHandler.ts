import { EventHandlerInterface } from "../EventHandlerInterface";
import { ZoneChannelEvent } from "../EventTypes";
import Logger from "../../../Log/Logger";

export class ChannelInactiveDeleteHandler implements EventHandlerInterface
{
    constructor(private readonly logger: Logger, private readonly event: ZoneChannelEvent)
    {

    }

    async handle(): Promise<void>
    {
        this.logger.info('Crawler deleted inactive channel', {
            canShare: true,
            context: {
                channelId: this.event.channelId
            }
        });
    }
}