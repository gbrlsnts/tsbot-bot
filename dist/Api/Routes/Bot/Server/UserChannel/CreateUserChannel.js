"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const CreateUserChannelAction_1 = require("../../../../../Bot/Action/UserChannel/CreateUserChannel/CreateUserChannelAction");
const ApiRoute_1 = require("../../../../ApiRoute");
const ValidationRules_1 = require("./ValidationRules");
const Validator_1 = __importDefault(require("../../../../Validator"));
class CreateUserChannel extends ApiRoute_1.ApiRoute {
    constructor(app, bot) {
        super();
        this.app = app;
        this.bot = bot;
    }
    /**
     * Register the route
     */
    register() {
        const validator = new Validator_1.default(this.getSchema());
        this.app.post(this.getWithPrefix('createUserChannel'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new CreateUserChannelAction_1.CreateUserChannelAction(this.bot, req.body).execute())
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
        return this;
    }
    /**
     * Get the validation schema
     */
    getSchema() {
        return joi_1.default.object(ValidationRules_1.createChannel);
    }
}
exports.CreateUserChannel = CreateUserChannel;
//# sourceMappingURL=CreateUserChannel.js.map