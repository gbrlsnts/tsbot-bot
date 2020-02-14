"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const awilix = __importStar(require("awilix"));
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
const ConnectionProtocol_1 = require("./ConnectionProtocol");
const Bot_1 = require("./Bot");
const MasterEventHandler_1 = require("./Event/MasterEventHandler");
const Context_1 = require("./Context");
const Factory_1 = require("./Configuration/Factory");
const Crawler_1 = require("./Crawler/Crawler");
class Factory {
    async create(server) {
        const container = awilix.createContainer({
            injectionMode: "CLASSIC"
        });
        const configuration = await new Factory_1.Factory().create().loadConfiguration(server);
        const ts3server = await ts3_nodejs_library_1.TeamSpeak.connect({
            ...configuration.connection,
            protocol: configuration.connection.protocol === ConnectionProtocol_1.ConnectionProtocol.RAW ? ts3_nodejs_library_1.QueryProtocol.RAW : ts3_nodejs_library_1.QueryProtocol.SSH,
        });
        const whoami = await ts3server.whoami();
        const context = new Context_1.Context(whoami.client_database_id, whoami.client_id, whoami.client_unique_identifier, whoami.virtualserver_id, whoami.virtualserver_unique_identifier);
        const bot = new Bot_1.Bot(ts3server, context);
        // todo: improve container registrations
        container.register({
            config: awilix.asValue(configuration),
            bot: awilix.asValue(bot)
        });
        const eventHandler = new MasterEventHandler_1.MasterEventHandler(container);
        if (configuration.crawler) {
            new Crawler_1.Crawler(bot, configuration.crawler).boot();
        }
        return bot;
    }
}
exports.Factory = Factory;
//# sourceMappingURL=Factory.js.map