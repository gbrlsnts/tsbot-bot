import { Client } from 'nats';
import Manager from '../Bot/Manager';
import Validator from '../Validation/Validator';
import { ServerMsgSubscriber } from './Subscribers/Interfaces';
import { Either, Failure } from '../Lib/Library';

export class CommandGateway {
    private readonly validator: Validator;

    constructor(private manager: Manager, private nats: Client) {
        this.validator = new Validator();
    }

    subscribe(subscribers: ServerMsgSubscriber[]): void {
        subscribers.forEach(sub => {
            this.subscribeSubject(sub);
            this.manager.logger.debug(`subscribing to ${sub.getSubject()}`, {
                canShare: true,
            });
        });
    }

    private subscribeSubject(subscriber: ServerMsgSubscriber): void {
        this.nats.subscribe(subscriber.getSubject(), async (error, msg) => {
            if (error) {
                return this.manager.logger.error('nats subscribe error', {
                    error,
                });
            }

            const { subject, data, reply } = msg;

            this.manager.logger.debug('got nats data', {
                context: { subject, data, reply },
            });

            const schema = subscriber.getValidationSchema();

            try {
                const dataObject = JSON.parse(data);

                if (schema)
                    await this.validator.validateSchema(schema, dataObject);

                const result = await subscriber.handle({
                    data: dataObject,
                    serverId: subject.split('.')?.[
                        subscriber.getServerIdPosition()
                    ],
                    subject,
                });

                if (!reply) return;
                this.reply(reply, result);
            } catch (error) {
                if (reply)
                    this.replyError(reply, error?.message || error.toString());

                console.error(error);

                return this.manager.logger.error(subscriber.getSubject(), {
                    canShare: true,
                    error,
                });
            }
        });
    }

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

    private replyError(inbox: string, error: string): void {
        this.sendReply(inbox, { error });
    }

    private sendReply(inbox: string, data: any): void {
        this.nats.publish(inbox, JSON.stringify(data), error => {
            if (error) this.manager.logger.error('nats reply error', { error });
        });
    }
}
