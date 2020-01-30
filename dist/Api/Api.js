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
const bodyParser = __importStar(require("body-parser"));
const CreateUserChannelAction_1 = require("../Bot/Actions/CreateUserChannel/CreateUserChannelAction");
class Api {
    constructor(bot) {
        this.bot = bot;
        this.app = express_1.default();
    }
    boot() {
        this.app.use(bodyParser.json());
        this.registerRoutes();
        this.app.listen(3000, () => console.log('Api waiting for requests...'));
    }
    registerRoutes() {
        this.app.get('/', (req, res) => {
            res.send('awesome-teamspeak bot');
        });
        this.app.post('/bot/server/createUserChannel', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const createUserChannel = new CreateUserChannelAction_1.CreateUserChannelAction(this.bot, req.body);
            console.log('Create user channel', req.body);
            createUserChannel.execute()
                .then(result => {
                console.log('Sending success response...');
                res.send(result.getResultData());
            })
                .catch(e => {
                console.log('Sending error response...', e.message);
                res.status(500).send(e.message);
            });
        }));
    }
}
exports.Api = Api;
//# sourceMappingURL=Api.js.map