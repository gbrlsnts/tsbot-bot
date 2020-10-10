"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const path_1 = require("path");
const Factory_1 = require("./Bot/Configuration/Factory");
const Factory_2 = __importDefault(require("./Bot/Factory"));
const Logger_1 = __importDefault(require("./Log/Logger"));
const Commands_1 = require("./Commands/Commands");
const InstanceManager_1 = require("./Instance/InstanceManager");
const serverName = process.env.SERVER_NAME || config_1.default.get('server.name');
const natsEnabled = process.env.NATS_ENABLED || config_1.default.get('nats.enabled');
const logger = new Logger_1.default({ level: 'debug' });
logger.debug('Initializing instance');
let instanceManager;
new Promise(async (resolve, reject) => {
    try {
        const configLoader = new Factory_1.Factory({
            mode: 'local',
            configFolder: path_1.resolve('server_configs'),
        }).create();
        resolve(new InstanceManager_1.InstanceManager(new Factory_2.default(configLoader, logger)));
    }
    catch (error) {
        reject(error);
    }
})
    .then(manager => {
    instanceManager = manager;
    if (natsEnabled)
        return new Commands_1.Commands(logger, instanceManager).init();
})
    .then(() => {
    return instanceManager.loadInstance(serverName);
})
    .catch(error => {
    logger.error('Error loading bot instance', { error });
});
//# sourceMappingURL=init.js.map