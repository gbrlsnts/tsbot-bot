import { Client } from 'nats';
import Manager from '../Bot/Manager';
import { CreateUserChannelHandler } from './Handlers/CreateUserChannel';
import * as nats from 'nats';

export class CommandGateway {
    constructor(private manager: Manager, private nats: Client) {}

    subscribe(): void {
        const handler = new CreateUserChannelHandler(this.manager);

        this.nats.subscribe(handler.getSubject(), (err, msg) => {
            console.log(msg.subject, msg.data, msg.reply);
            if (err) return console.log(err);

            if (msg.reply) {
                const replyData = {
                    channel: Math.floor(Math.random() * 1000) + 1,
                };

                this.nats.publish(msg.reply, JSON.stringify(replyData), e => {
                    if (e) console.log('error', e);
                });
            }
            //handler.handle(msg);
        });
    }
}
