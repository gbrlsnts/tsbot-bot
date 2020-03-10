"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiRoute_1 = require("../../../../ApiRoute");
const CreateUserSubChannelAction_1 = require("../../../../../Bot/Action/UserChannel/CreateUserSubChannel/CreateUserSubChannelAction");
const Joi = require("@hapi/joi");
const ValidationRules_1 = require("./ValidationRules");
const Validator_1 = __importDefault(require("../../../../Validator"));
class CreateUserSubChannel extends ApiRoute_1.ApiRoute {
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
        this.app.post(this.getWithPrefix('createUserSubChannel'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new CreateUserSubChannelAction_1.CreateUserSubChannelAction(this.bot, req.body).execute())
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
        return this;
    }
    /**
     * Get the validation schema
     */
    getSchema() {
        return Joi.object(ValidationRules_1.createSubChannel);
    }
}
exports.CreateUserSubChannel = CreateUserSubChannel;
//# sourceMappingURL=CreateUserSubChannel.js.map