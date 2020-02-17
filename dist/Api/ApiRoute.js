"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseMapper_1 = require("./ResponseMapper");
class ApiRoute {
    /**
     * Map a request result to a response
     * @param result The result to map
     */
    mapToResponse(response, result) {
        return new ResponseMapper_1.ResponseMapper(response).fromDomain(result);
    }
    /**
     * Map a request exception to a response
     * @param result The exception to map
     */
    mapToExceptionResponse(response, exception) {
        return new ResponseMapper_1.ResponseMapper(response).fromException(exception);
    }
}
exports.ApiRoute = ApiRoute;
//# sourceMappingURL=ApiRoute.js.map