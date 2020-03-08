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
        if (!(exception instanceof Error)) {
            return this.getResponseObject()
                .status(500)
                .error('Unknown error', 'Unknown error');
        }
        if (this.isValidationException(exception)) {
            return new Response_1.Response(this.response)
                .status(422)
                .addErrors(exception.details.map(error => {
                var _a;
                return {
                    title: 'Field failed validation: ' + error.type,
                    detail: error.message,
                    source: {
                        pointer: ((_a = error.context) === null || _a === void 0 ? void 0 : _a.label) || '',
                    }
                };
            }));
        }
        return this.getResponseObject()
            .status(500)
            .error(exception.name, exception.message);
    }
    isValidationException(exception) {
        return 'isJoi' in exception;
    }
    getResponseObject() {
        return new Response_1.Response(this.response);
    }
}
exports.ResponseMapper = ResponseMapper;
//# sourceMappingURL=ResponseMapper.js.map