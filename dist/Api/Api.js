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
const express_1 = __importDefault(require("express"));
const express_pino_logger_1 = __importDefault(require("express-pino-logger"));
const bodyParser = __importStar(require("body-parser"));
const BotGroup_1 = __importDefault(require("./Routes/Bot/BotGroup"));
class Api {
    constructor(manager, logger) {
        this.manager = manager;
        this.logger = logger;
        this.app = express_1.default();
        this.app.use(express_pino_logger_1.default({
            logger: logger.logger
        }));
    }
    boot() {
        this.app.use(bodyParser.json());
        this.registerRoutes();
        this.app.listen(3000, () => this.logger.info('Api waiting for requests...'));
    }
    registerRoutes() {
        this.app.get('/', (req, res) => {
            res.send('awesome-teamspeak bot');
        });
        new BotGroup_1.default(this.app, this.manager, this.logger).setPrefix('/bot').register();
    }
}
exports.Api = Api;
//# sourceMappingURL=Api.js.map