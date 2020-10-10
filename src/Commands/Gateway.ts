import { Client } from 'nats';
import Validator from '../Validation/Validator';
import { SubscribesServerMessages } from './Subscribers/Interfaces';
import { Either, Failure } from '../Lib/Library';
import { InstanceManager } from '../Instance/InstanceManager';
import Logger from '../Log/Logger';

export class CommandGateway {
    private readonly validator: Validator;

    constructor(
        private readonly logger: Logger,
        private readonly instanceManager: InstanceManager,
        private readonly nats: Client
    ) {
        this.validator = new Validator();
    }

    /**
     * Registers all subscribers
     * @param subscribers
     */
    subscribe(subscribers: SubscribesServerMessages[]): void {
        subscribers.forEach(sub => {
            this.subscribeSubject(sub);
            this.logger.debug(`subscribing to ${sub.getSubject()}`, {
                canShare: true,
            });
        });
    }

    /**
     * Register a subscriber
     * @param subscriber
     */
    subscribeSubject(subscriber: SubscribesServerMessages): void {
        this.nats.subscribe(subscriber.getSubject(), async (error, msg) => {
            if (error) {
                return this.logger.error('nats subscribe error', {
                    error,
                });
            }

            const { subject, data, reply } = msg;

            this.logger.debug('got nats data', {
                context: { subject, data, reply },
            });

            const serverId = Number(
                subject.split('.')?.[subscriber.getServerIdPosition()]
            );

            const botManager = this.instanceManager.getInstance(serverId);

            if (!serverId || !botManager) {
                this.logger.debug('ignoring message, no instance found', {
                    context: { serverId },
                });

                return;
            }

            const schema = subscriber.getValidationSchema();

            try {
                const dataObject = JSON.parse(data);

                if (schema)
                    await this.validator.validateSchema(schema, dataObject);

                const result = await subscriber.handle(botManager, {
                    data: dataObject,
                    serverId,
                    subject,
                });

                if (!reply) return;
                this.reply(reply, result);
            } catch (error) {
                if (reply)
                    this.replyError(reply, error?.message || error.toString());

                console.error(error);

                return this.logger.error(subscriber.getSubject(), {
                    canShare: true,
                    error,
                });
            }
        });
    }

    /**
     * Reply to a message
     * @param inbox inbox to reply to
     * @param result results to send
     */
    private reply(inbox: string, result: Either<Failure<any>, any>): void {
        let response;

        if (result.isLeft()) {
            response = {
                error: result.value.reason,
            };
        } else {
            response = {
                data: result.value,
            };
        }

        this.sendReply(inbox, response);
    }

    /**
     * Reply as error
     * @param inbox inbox to reply to
     * @param error error to send
     */
    private replyError(inbox: string, error: string): void {
        this.sendReply(inbox, { error });
    }

    /**
     * Reply with data
     * @param inbox inbox to reply to
     * @param data data to send
     */
    private sendReply(inbox: string, data: any): void {
        this.nats.publish(inbox, JSON.stringify(data), error => {
            if (error) this.logger.error('nats reply error', { error });
        });
    }
}
