"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiRoute_1 = require("../../../../ApiRoute");
const DeleteUserChannelAction_1 = require("../../../../../Bot/Action/UserChannel/DeleteUserChannelAction");
const Joi = require("@hapi/joi");
const UserChannelValidationRules_1 = require("../../../../../Validation/UserChannel/UserChannelValidationRules");
const Validator_1 = __importDefault(require("../../../../../Validation/Validator"));
class DeleteUserChannel extends ApiRoute_1.ApiRoute {
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
        this.app.post(this.getWithPrefix('deleteUserChannel'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new DeleteUserChannelAction_1.DeleteUserChannelAction(this.manager.logger, this.manager.bot, req.body).execute())
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
        return this;
    }
    /**
     * Get the validation schema
     */
    getSchema() {
        return Joi.object(UserChannelValidationRules_1.deleteChannel);
    }
}
exports.DeleteUserChannel = DeleteUserChannel;
//# sourceMappingURL=DeleteUserChannel.js.map