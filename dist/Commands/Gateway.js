"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = __importDefault(require("../Validation/Validator"));
class CommandGateway {
    constructor(logger, instanceManager, nats) {
        this.logger = logger;
        this.instanceManager = instanceManager;
        this.nats = nats;
        this.validator = new Validator_1.default();
    }
    /**
     * Registers all subscribers
     * @param subscribers
     */
    subscribe(subscribers) {
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
    subscribeSubject(subscriber) {
        this.nats.subscribe(subscriber.getSubject(), async (error, msg) => {
            var _a, _b;
            if (error) {
                return this.logger.error('nats subscribe error', {
                    error,
                });
            }
            const { subject, data, reply } = msg;
            this.logger.debug('got nats data', {
                context: { subject, data, reply },
            });
            const serverId = Number((_a = subject.split('.')) === null || _a === void 0 ? void 0 : _a[subscriber.getServerIdPosition()]);
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
                if (!reply)
                    return;
                this.reply(reply, result);
            }
            catch (error) {
                if (reply)
                    this.replyError(reply, ((_b = error) === null || _b === void 0 ? void 0 : _b.message) || error.toString());
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
    /**
     * Reply as error
     * @param inbox inbox to reply to
     * @param error error to send
     */
    replyError(inbox, error) {
        this.sendReply(inbox, { error });
    }
    /**
     * Reply with data
     * @param inbox inbox to reply to
     * @param data data to send
     */
    sendReply(inbox, data) {
        this.nats.publish(inbox, JSON.stringify(data), error => {
            if (error)
                this.logger.error('nats reply error', { error });
        });
    }
}
exports.CommandGateway = CommandGateway;
//# sourceMappingURL=Gateway.js.map