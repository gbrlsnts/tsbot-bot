"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const ApiRoute_1 = require("../../../../ApiRoute");
const Validator_1 = __importDefault(require("../../../../Validator"));
const IconUploadAction_1 = __importDefault(require("../../../../../Bot/Action/Icon/IconUploadAction"));
class IconUpload extends ApiRoute_1.ApiRoute {
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
        this.app.post(this.getWithPrefix('iconUpload'), async (req, res) => {
            validator.validate(req.body)
                .then(() => this.mapRequest(req.body))
                .then((data) => new IconUploadAction_1.default(this.bot, data).execute())
                .then((result) => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
        return this;
    }
    /**
     * Map the incoming request to action data
     * @param request request to map
     */
    async mapRequest(request) {
        return Promise.resolve({
            icon: Buffer.from(request.icon, 'base64'),
        });
    }
    /**
     * Get the validation schema
     */
    getSchema() {
        return joi_1.default.object({
            icon: joi_1.default.string().required().min(1),
        });
    }
}
exports.default = IconUpload;
//# sourceMappingURL=IconUpload.js.map