"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const ApiRoute_1 = require("../../../ApiRoute");
const Validator_1 = __importDefault(require("../../../../Validation/Validator"));
const Either_1 = require("../../../../Lib/Either");
class SetConfig extends ApiRoute_1.ApiRoute {
    constructor(app, manager, logger) {
        super(logger);
        this.app = app;
        this.manager = manager;
    }
    /**
     * Register the route
     */
    register() {
        const validator = new Validator_1.default(this.getSchema());
        this.app.post(this.getWithPrefix('setConfig'), async (req, res) => {
            validator.validate(req.body)
                .then((config) => this.manager.setCrawlerConfig(config))
                .then(() => this.mapToResponse(res, Either_1.right(true)).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
        return this;
    }
    /**
     * Get the validation schema
     */
    getSchema() {
        return joi_1.default.object({
            interval: joi_1.default.number().required().min(30).max(14400),
            zones: joi_1.default.array().required().min(1).items(joi_1.default.object().keys({
                name: joi_1.default.string().required().min(1),
                spacerAsSeparator: joi_1.default.boolean().required(),
                start: joi_1.default.number().required().min(1),
                end: joi_1.default.number().required().min(1),
                inactiveIcon: joi_1.default.number().min(1),
                timeInactiveNotify: joi_1.default.number().required().min(1),
                timeInactiveMax: joi_1.default.number().required().min(1).greater(joi_1.default.ref('timeInactiveNotify')),
            })),
        });
    }
}
exports.default = SetConfig;
//# sourceMappingURL=SetConfig.js.map