"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const ApiRoute_1 = require("../../../../ApiRoute");
const VerifyUserAction_1 = __importDefault(require("../../../../../Bot/Action/VerifyUser/VerifyUserAction"));
const Validator_1 = __importDefault(require("../../../../Validator"));
class VerifyUser extends ApiRoute_1.ApiRoute {
    constructor(app, bot, globalLogger) {
        super(globalLogger);
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
        return joi_1.default.object({
            targets: joi_1.default.array().required().min(1).unique('clientId').unique('token').items(joi_1.default.object().keys({
                clientId: joi_1.default.number().required().min(1),
                token: joi_1.default.string().required().min(1).max(40),
            })),
        });
    }
}
exports.default = VerifyUser;
//# sourceMappingURL=VerifyUser.js.map