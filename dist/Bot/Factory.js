"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
const ConnectionProtocol_1 = require("./ConnectionProtocol");
const Bot_1 = require("./Bot");
const EventHandler_1 = require("./EventHandler");
const Context_1 = require("./Context");
class Factory {
    constructor(connectionConfiguration) {
        this.connectionConfiguration = connectionConfiguration;
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const protocol = this.connectionConfiguration.protocol === ConnectionProtocol_1.ConnectionProtocol.ssh ? ts3_nodejs_library_1.QueryProtocol.SSH : ts3_nodejs_library_1.QueryProtocol.RAW;
            const ts3server = yield ts3_nodejs_library_1.TeamSpeak.connect({
                host: this.connectionConfiguration.host,
                queryport: this.connectionConfiguration.queryport,
                serverport: this.connectionConfiguration.serverport,
                nickname: this.connectionConfiguration.nickname,
                username: this.connectionConfiguration.username,
                password: this.connectionConfiguration.password,
                protocol,
            });
            const whoami = yield ts3server.whoami();
            const context = new Context_1.Context(whoami.client_database_id, whoami.client_id, whoami.client_unique_identifier, whoami.virtualserver_id, whoami.virtualserver_unique_identifier);
            const eventHandler = new EventHandler_1.EventHandler(ts3server);
            return new Bot_1.Bot(ts3server, context, eventHandler);
        });
    }
}
exports.Factory = Factory;
//# sourceMappingURL=Factory.js.map