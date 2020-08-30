"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateUserChannel_1 = require("./Handlers/CreateUserChannel");
class CommandGateway {
    constructor(manager, nats) {
        this.manager = manager;
        this.nats = nats;
    }
    subscribe() {
        const handler = new CreateUserChannel_1.CreateUserChannelHandler(this.manager);
        this.nats.subscribe(handler.getSubject(), (err, msg) => {
            console.log(msg.subject, msg.data, msg.reply);
            if (err)
                return console.log(err);
            if (msg.reply) {
                const replyData = {
                    channel: Math.floor(Math.random() * 1000) + 1,
                };
                this.nats.publish(msg.reply, JSON.stringify(replyData), e => {
                    if (e)
                        console.log('error', e);
                });
            }
            //handler.handle(msg);
        });
    }
}
exports.CommandGateway = CommandGateway;
//# sourceMappingURL=Gateway.js.map