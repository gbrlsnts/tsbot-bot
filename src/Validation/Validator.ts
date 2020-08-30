import { ValidationOptions } from '@hapi/joi';
import Joi = require('@hapi/joi');

export default class Validator {
    private readonly defaultValidationOptions: ValidationOptions = {
        abortEarly: false,
    };

    /**
     * Create an object insteace of a validator
     * @param schema Schema for this validator
     */
    constructor(private readonly schema?: Joi.ObjectSchema) {}

    /**
     * Validate request data
     * @param data Data to validate
     * @param validationOptions Options for the validation. Will override default options
     */
    async validate(
        data: any,
        validationOptions?: ValidationOptions
    ): Promise<any> {
        if (!this.schema) throw new Error('no schema provided');

        return await this.schema.validateAsync(
            data,
            validationOptions || this.defaultValidationOptions
        );
    }

    /**
     * Validate request data against a schema
     * @param schema schema to use for validation
     * @param data Data to validate
     * @param validationOptions Options for the validation. Will override default options
     */
    async validateSchema(
        schema: Joi.ObjectSchema,
        data: any,
        validationOptions?: ValidationOptions
    ): Promise<any> {
        return await schema.validateAsync(
            data,
            validationOptions || this.defaultValidationOptions
        );
    }
}
