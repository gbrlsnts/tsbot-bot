"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const ApiRoute_1 = require("../../../../ApiRoute");
const Validator_1 = __importDefault(require("../../../../../Validation/Validator"));
const SetUserGroupsAction_1 = __importDefault(require("../../../../../Bot/Action/UserGroups/SetUserGroupsAction"));
const UserGroups_1 = require("../../../../../Validation/UserGroups");
class SetUserGroups extends ApiRoute_1.ApiRoute {
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
        this.app.post(this.getWithPrefix('setUserGroups'), async (req, res) => {
            validator
                .validate(req.body)
                .then(() => new SetUserGroupsAction_1.default(this.bot, {
                ...req.body,
                trustedSource: false,
            }).execute())
                .then(result => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
        return this;
    }
    /**
     * Get the validation schema
     */
    getSchema() {
        return joi_1.default.object(UserGroups_1.setUserGroupsBase);
    }
}
exports.default = SetUserGroups;
//# sourceMappingURL=SetUserGroups.js.map