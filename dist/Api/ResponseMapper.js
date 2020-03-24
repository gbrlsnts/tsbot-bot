"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("./Response");
class ResponseMapper {
    constructor(logger) {
        this.logger = logger;
    }
    /**
     * Map a response from a domain result
     * @param response The express response
     * @param domainResult The domain result
     */
    fromDomain(response, domainResult) {
        const res = new Response_1.Response(response);
        if (domainResult.isLeft()) {
            return res
                .status(422)
                .error(domainResult.value.type, domainResult.value.reason);
        }
        return res.data(domainResult.value);
    }
    /**
     * Map a response from an exception
     * @param response The express response
     * @param domainResult The domain result
     */
    fromException(response, exception) {
        if (!(exception instanceof Error)) {
            return new Response_1.Response(response)
                .status(500)
                .error('Unknown error', 'Unknown error');
        }
        if (this.isValidationException(exception)) {
            return new Response_1.Response(response)
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
        this.logger.error('Api exception', {
            error: exception
        });
        return new Response_1.Response(response)
            .status(500)
            .error(exception.name, exception.message);
    }
    /**
     * Check if the exception is from validations
     * @param exception Exception to check
     */
    isValidationException(exception) {
        return 'isJoi' in exception;
    }
}
exports.ResponseMapper = ResponseMapper;
//# sourceMappingURL=ResponseMapper.js.map