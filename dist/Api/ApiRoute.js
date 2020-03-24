"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseMapper_1 = require("./ResponseMapper");
const PrefixedRoute_1 = require("./PrefixedRoute");
class ApiRoute extends PrefixedRoute_1.PrefixedRoute {
    constructor(logger) {
        super();
        this.mapper = new ResponseMapper_1.ResponseMapper(logger);
    }
    /**
     * Map a request result to a response
     * @param result The result to map
     */
    mapToResponse(response, result) {
        return this.mapper.fromDomain(response, result);
    }
    /**
     * Map a request exception to a response
     * @param result The exception to map
     */
    mapToExceptionResponse(response, exception) {
        return this.mapper.fromException(response, exception);
    }
}
exports.ApiRoute = ApiRoute;
//# sourceMappingURL=ApiRoute.js.map