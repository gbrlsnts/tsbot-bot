"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validator {
    /**
     * Create an object insteace of a validator
     * @param schema Schema for this validator
     */
    constructor(schema) {
        this.schema = schema;
        this.defaultValidationOptions = {
            abortEarly: false,
        };
    }
    /**
     * Validate request data
     * @param data Data to validate
     * @param validationOptions Options for the validation. Will override default options
     */
    async validate(data, validationOptions) {
        return await this.schema
            .validateAsync(data, validationOptions || this.defaultValidationOptions);
    }
}
exports.default = Validator;
//# sourceMappingURL=Validator.js.map