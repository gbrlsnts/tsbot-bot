"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const ApiRoute_1 = require("../../../../ApiRoute");
const Validator_1 = __importDefault(require("../../../../Validator"));
const SetUserGroupsAction_1 = __importDefault(require("../../../../../Bot/Action/UserGroups/SetUserGroupsAction"));
class SetUserGroups extends ApiRoute_1.ApiRoute {
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
        this.app.post(this.getWithPrefix('setUserGroups'), async (req, res) => {
            validator.validate(req.body)
                .then(() => new SetUserGroupsAction_1.default(this.bot, req.body).execute())
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
            clientDatabaseId: joi_1.default.number().required().min(1),
            groups: joi_1.default.array().required().unique().items(joi_1.default.number().min(1)),
        });
    }
}
exports.default = SetUserGroups;
//# sourceMappingURL=SetUserGroups.js.map