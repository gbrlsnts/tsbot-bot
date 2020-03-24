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
const path_1 = require("path");
const Factory_1 = require("./Bot/Configuration/Factory");
const Factory_2 = __importDefault(require("./Bot/Factory"));
const Logger_1 = __importDefault(require("./Log/Logger"));
function configureContainer() {
    const container = awilix.createContainer({
        injectionMode: "CLASSIC",
    });
    container.register({
        logger: awilix.asValue(new Logger_1.default({ level: 'debug' })),
        configLoader: awilix.asValue(configurationLoader()),
        botFactory: awilix.asClass(Factory_2.default).singleton(),
    });
    return container;
}
exports.default = configureContainer;
;
const configurationLoader = () => {
    return new Factory_1.Factory({
        mode: 'local',
        configFolder: path_1.resolve('server_configs'),
    }).create();
};
//# sourceMappingURL=container.js.map