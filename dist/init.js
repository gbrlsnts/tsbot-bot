"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const awilix = __importStar(require("awilix"));
const container_1 = __importDefault(require("./container"));
const Commands_1 = require("./Commands/Commands");
const InstanceManager_1 = require("./Instance/InstanceManager");
const apiEnabled = process.env.API_ENABLED || config_1.default.get('api.enabled');
const natsEnabled = process.env.NATS_ENABLED || config_1.default.get('nats.enabled');
const container = container_1.default();
const scoped = container.createScope();
const logger = scoped.resolve('logger');
scoped.register({
    serverName: awilix.asValue(process.env.SERVER_NAME || config_1.default.get('server.name')),
});
logger.debug('Initializing instance');
const botFactory = container.resolve('botFactory');
const instanceManager = new InstanceManager_1.InstanceManager(botFactory);
new Promise(async (resolve, reject) => {
    try {
        //if (apiEnabled) new Api(instanceManager, logger).boot();
        if (natsEnabled)
            await new Commands_1.Commands(logger, instanceManager).init();
    }
    catch (error) {
        return reject(error);
    }
    resolve();
})
    .then(() => {
    return instanceManager.loadInstance(scoped.resolve('serverName'));
})
    .catch(error => {
    logger.error('Error loading bot instance', { error });
});
//# sourceMappingURL=init.js.map