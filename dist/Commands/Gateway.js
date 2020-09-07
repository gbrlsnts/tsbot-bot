"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = __importDefault(require("../Validation/Validator"));
class CommandGateway {
    constructor(manager, nats) {
        this.manager = manager;
        this.nats = nats;
        this.validator = new Validator_1.default();
    }
    subscribe(subscribers) {
        subscribers.forEach(sub => this.subscribeSubject(sub));
    }
    subscribeSubject(subscriber) {
        this.nats.subscribe(subscriber.getSubject(), async (error, msg) => {
            var _a, _b;
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
                    serverId: (_a = subject.split('.')) === null || _a === void 0 ? void 0 : _a[subscriber.getServerIdPosition()],
                    subject,
                });
                if (!reply)
                    return;
                this.reply(reply, result);
            }
            catch (error) {
                if (reply)
                    this.replyError(reply, ((_b = error) === null || _b === void 0 ? void 0 : _b.message) || error.toString());
                return this.manager.logger.error(subscriber.getSubject(), {
                    canShare: true,
                    error,
                });
            }
        });
    }
    reply(inbox, result) {
        let response;
        if (result.isLeft()) {
            response = {
                error: result.value.reason,
            };
        }
        else {
            response = {
                data: result.value,
            };
        }
        this.sendReply(inbox, response);
    }
    replyError(inbox, error) {
        this.sendReply(inbox, { error });
    }
    sendReply(inbox, data) {
        this.nats.publish(inbox, JSON.stringify(data), error => {
            if (error)
                this.manager.logger.error('nats reply error', { error });
        });
    }
}
exports.CommandGateway = CommandGateway;
//# sourceMappingURL=Gateway.js.map