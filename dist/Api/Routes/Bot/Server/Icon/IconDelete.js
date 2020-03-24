"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const ApiRoute_1 = require("../../../../ApiRoute");
const Validator_1 = __importDefault(require("../../../../Validator"));
const IconDeleteAction_1 = __importDefault(require("../../../../../Bot/Action/Icon/IconDeleteAction"));
class IconDelete extends ApiRoute_1.ApiRoute {
    constructor(app, bot, logger) {
        super(logger);
        this.app = app;
        this.bot = bot;
    }
    /**
     * Register the route
     */
    register() {
        const validator = new Validator_1.default(this.getSchema());
        this.app.post(this.getWithPrefix('iconDelete'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new IconDeleteAction_1.default(this.bot, req.body).execute())
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
            iconId: joi_1.default.number().required().min(1),
        });
    }
}
exports.default = IconDelete;
//# sourceMappingURL=IconDelete.js.map