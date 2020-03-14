"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiRoute_1 = require("../../../../ApiRoute");
const VerifyUserAction_1 = __importDefault(require("../../../../../Bot/Action/VerifyUser/VerifyUserAction"));
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
        this.app.post(this.getWithPrefix('verifyUser'), async (req, res) => {
            new VerifyUserAction_1.default(this.bot, req.body).execute()
                .then((result) => this.mapToResponse(res, result).send())
                .catch(e => this.mapToExceptionResponse(res, e).send());
        });
        return this;
    }
}
exports.default = VerifyUser;
//# sourceMappingURL=VerifyUser.js.map