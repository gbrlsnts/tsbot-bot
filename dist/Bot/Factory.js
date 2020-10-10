"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
const Types_1 = require("./Types");
const Bot_1 = require("./Bot");
const MasterEventHandler_1 = require("./Event/MasterEventHandler");
const Crawler_1 = require("./Crawler/Crawler");
const Manager_1 = __importDefault(require("./Manager"));
class Factory {
    constructor(configLoader, logger) {
        this.configLoader = configLoader;
        this.logger = logger;
    }
    async create(serverName) {
        const config = await this.configLoader.loadConfiguration(serverName);
        const botLogger = this.logger.scoped({
            server: serverName,
        });
        const bot = await Bot_1.Bot.initialize(botLogger, config.id, serverName, {
            ...config.connection,
            protocol: config.connection.protocol === Types_1.ConnectionProtocol.RAW
                ? ts3_nodejs_library_1.QueryProtocol.RAW
                : ts3_nodejs_library_1.QueryProtocol.SSH,
        });
        const eventHandler = new MasterEventHandler_1.MasterEventHandler(botLogger, bot);
        let crawler;
        if (config.crawler) {
            crawler = new Crawler_1.Crawler(bot, botLogger, config.crawler);
            crawler.boot();
        }
        return new Manager_1.default({
            bot,
            eventHandler,
            crawler,
            logger: botLogger,
        });
    }
}
exports.default = Factory;
//# sourceMappingURL=Factory.js.map