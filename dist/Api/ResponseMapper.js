"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("./Response");
class ResponseMapper {
    constructor(response) {
        this.response = response;
    }
    /**
     * Map a response from a domain result
     * @param domainResult The domain result
     */
    fromDomain(domainResult) {
        const res = this.getResponseObject();
        if (domainResult.isLeft()) {
            return res
                .status(422)
                .error(domainResult.value.type, domainResult.value.reason);
        }
        return res.data(domainResult.value);
    }
    /**
     * Map a response from an exception
     * @param domainResult The domain result
     */
    fromException(exception) {
        const res = this.getResponseObject().status(500);
        if (exception instanceof Error) {
            return res.error(exception.name, exception.message);
        }
        return res.error('Unknown error', 'Unknown error');
    }
    getResponseObject() {
        return new Response_1.Response(this.response);
    }
}
exports.ResponseMapper = ResponseMapper;
//# sourceMappingURL=ResponseMapper.js.map