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
const container_1 = __importDefault(require("./container"));
const Commands_1 = require("./Commands/Commands");
const container = container_1.default();
const scoped = container.createScope();
const logger = scoped.resolve('logger');
scoped.register({
    serverName: awilix.asValue('testserver'),
});
logger.debug('Initializing instance');
container
    .resolve('botFactory')
    .create(scoped.resolve('serverName'))
    .then(async (manager) => {
    scoped.register({
        manager: awilix.asValue(manager),
        bot: awilix.asValue(manager.bot),
        logger: awilix.asValue(manager.logger),
    });
    //new Api(manager, logger).boot();
    await new Commands_1.Commands(manager).init();
})
    .catch(error => {
    logger.error('Error initializing bot', { error });
});
//# sourceMappingURL=init.js.map