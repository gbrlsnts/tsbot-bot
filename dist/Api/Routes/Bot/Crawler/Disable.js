"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiRoute_1 = require("../../../ApiRoute");
const Either_1 = require("../../../../Lib/Either");
class Disable extends ApiRoute_1.ApiRoute {
    constructor(app, manager) {
        super();
        this.app = app;
        this.manager = manager;
    }
    /**
     * Register the route
     */
    register() {
        this.app.post(this.getWithPrefix('disable'), async (req, res) => {
            this.manager.disableCrawler();
            this.mapToResponse(res, Either_1.right(true)).send();
        });
        return this;
    }
}
exports.default = Disable;
//# sourceMappingURL=Disable.js.map