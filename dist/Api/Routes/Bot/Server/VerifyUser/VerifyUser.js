"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("@hapi/joi");
const ApiRoute_1 = require("../../../../ApiRoute");
const VerifyUserAction_1 = __importDefault(require("../../../../../Bot/Action/VerifyUser/VerifyUserAction"));
const Validator_1 = __importDefault(require("../../../../Validator"));
class VerifyUser extends ApiRoute_1.ApiRoute {
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
        this.app.post(this.getWithPrefix('verifyUser'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new VerifyUserAction_1.default(this.bot, req.body).execute())
                .then((result) => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
        return this;
    }
    /**
     * Get the validation schema
     */
    getSchema() {
        return Joi.object({
            targets: Joi.array().required().min(1).unique('clientId').unique('token').items(Joi.object().keys({
                clientId: Joi.number().required().min(1),
                token: Joi.string().required().min(1).max(40),
            })),
        });
    }
}
exports.default = VerifyUser;
//# sourceMappingURL=VerifyUser.js.map