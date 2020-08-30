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
        if (!this.schema)
            throw new Error('no schema provided');
        return await this.schema.validateAsync(data, validationOptions || this.defaultValidationOptions);
    }
    /**
     * Validate request data against a schema
     * @param schema schema to use for validation
     * @param data Data to validate
     * @param validationOptions Options for the validation. Will override default options
     */
    async validateSchema(schema, data, validationOptions) {
        return await schema.validateAsync(data, validationOptions || this.defaultValidationOptions);
    }
}
exports.default = Validator;
//# sourceMappingURL=Validator.js.map