"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Connector_1 = require("./Nats/Connector");
const Gateway_1 = require("./Gateway");
class Commands {
    constructor(manager) {
        this.manager = manager;
    }
    async init() {
        const nats = await new Connector_1.NatsConnector().connect();
        const gateway = new Gateway_1.CommandGateway(this.manager, nats);
        gateway.subscribe();
        this.manager.logger.info('Command gateway initialized');
    }
}
exports.Commands = Commands;
//# sourceMappingURL=Commands.js.map