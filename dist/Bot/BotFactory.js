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
const BotEventHandler_1 = require("./BotEventHandler");
class BotFactory {
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
            new BotEventHandler_1.BotEventHandler(ts3server);
            return new Bot_1.Bot(ts3server);
        });
    }
}
exports.BotFactory = BotFactory;
//# sourceMappingURL=BotFactory.js.map