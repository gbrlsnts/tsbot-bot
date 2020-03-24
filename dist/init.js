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
const awilix = __importStar(require("awilix"));
const Api_1 = require("./Api/Api");
const container_1 = __importDefault(require("./container"));
const container = container_1.default();
const scoped = container.createScope();
const logger = scoped.resolve('logger');
scoped.register({
    serverName: awilix.asValue('testserver_crawl'),
});
logger.debug('Initializing instance');
container.resolve('botFactory')
    .create(scoped.resolve('serverName'))
    .then(manager => {
    scoped.register({
        manager: awilix.asValue(manager),
        bot: awilix.asValue(manager.bot),
        logger: awilix.asValue(manager.logger),
    });
    new Api_1.Api(manager, logger).boot();
})
    .catch(error => {
    logger.error('Error initializing bot', { error });
});
//# sourceMappingURL=init.js.map