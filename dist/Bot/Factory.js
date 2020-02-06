"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
const ConnectionProtocol_1 = require("./ConnectionProtocol");
const Bot_1 = require("./Bot");
const EventHandler_1 = require("./EventHandler");
const Context_1 = require("./Context");
const LocalLoader_1 = require("./Configuration/LocalLoader");
const path_1 = require("path");
const LocalRepository_1 = require("./Crawler/Repository/LocalRepository");
const Crawler_1 = require("./Crawler/Crawler");
class Factory {
    async create(server) {
        const configLoader = new LocalLoader_1.LocalLoader(path_1.resolve('server_configs'));
        const configuration = await configLoader.loadConfiguration(server);
        const ts3server = await ts3_nodejs_library_1.TeamSpeak.connect({
            host: configuration.connection.host,
            queryport: configuration.connection.queryport,
            serverport: configuration.connection.serverport,
            nickname: configuration.connection.nickname,
            username: configuration.connection.username,
            password: configuration.connection.password,
            protocol: configuration.connection.protocol === ConnectionProtocol_1.ConnectionProtocol.SSH
                ? ts3_nodejs_library_1.QueryProtocol.SSH : ts3_nodejs_library_1.QueryProtocol.RAW,
        });
        const whoami = await ts3server.whoami();
        const context = new Context_1.Context(whoami.client_database_id, whoami.client_id, whoami.client_unique_identifier, whoami.virtualserver_id, whoami.virtualserver_unique_identifier);
        const eventHandler = new EventHandler_1.EventHandler(ts3server);
        const bot = new Bot_1.Bot(ts3server, context, eventHandler);
        if (configuration.crawler) {
            new Crawler_1.Crawler(bot, this.getRepository(), configuration.crawler).boot();
        }
        return bot;
    }
    getRepository() {
        return new LocalRepository_1.LocalRepository(path_1.resolve('database'));
    }
}
exports.Factory = Factory;
//# sourceMappingURL=Factory.js.map