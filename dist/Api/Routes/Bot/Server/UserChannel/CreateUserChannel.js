"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const CreateUserChannelAction_1 = require("../../../../../Bot/Action/UserChannel/CreateUserChannelAction");
const ApiRoute_1 = require("../../../../ApiRoute");
const UserChannelValidationRules_1 = require("../../../../../Validation/UserChannel/UserChannelValidationRules");
const Validator_1 = __importDefault(require("../../../../../Validation/Validator"));
class CreateUserChannel extends ApiRoute_1.ApiRoute {
    constructor(app, manager, globalLogger) {
        super(globalLogger);
        this.app = app;
        this.manager = manager;
    }
    /**
     * Register the route
     */
    register() {
        const validator = new Validator_1.default(this.getSchema());
        this.app.post(this.getWithPrefix('createUserChannel'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new CreateUserChannelAction_1.CreateUserChannelAction(this.manager.logger, this.manager.bot, req.body).execute())
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
        return this;
    }
    /**
     * Get the validation schema
     */
    getSchema() {
        return joi_1.default.object(UserChannelValidationRules_1.createChannel);
    }
}
exports.CreateUserChannel = CreateUserChannel;
//# sourceMappingURL=CreateUserChannel.js.map