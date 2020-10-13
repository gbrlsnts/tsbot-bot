import { EventHandlerInterface } from '../EventHandlerInterface';
import { NatsConnector } from '../../../Commands/Nats/Connector';
import Logger from '../../../Log/Logger';
import { botConnectionLostSubject } from '../../../Commands/Shared/Subjects';

export class BotConnectionLostHandler implements EventHandlerInterface {
    constructor(
        private readonly serverId: number,
        private readonly logger: Logger,
        private readonly nats: NatsConnector
    ) {}

    async handle(): Promise<void> {
        this.nats
            .getClient()
            .publish(
                botConnectionLostSubject(this.serverId),
                undefined,
                error => {
                    if (error) this.logger.error(error.message, { error });
                }
            );
    }
}
