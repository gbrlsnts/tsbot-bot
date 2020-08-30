"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nats = __importStar(require("nats"));
const config_1 = __importDefault(require("config"));
const url = process.env.NATS_URL || config_1.default.get('nats.url');
class NatsConnector {
    constructor() { }
    async connect() {
        const client = nats.connect({
            url,
        });
        await this.waitForConnection(client);
        return client;
    }
    waitForConnection(client) {
        return new Promise((resolve, reject) => {
            client.on('connect', () => {
                resolve();
            });
            client.on('error', () => {
                reject();
            });
        });
    }
}
exports.NatsConnector = NatsConnector;
//# sourceMappingURL=Connector.js.map