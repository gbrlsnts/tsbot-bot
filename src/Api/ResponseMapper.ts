import { ValidationError } from "@hapi/joi";
import { Response as ExpressResponse } from "express";
import { Either } from "../Lib/Either";
import { Failure } from "../Lib/Failure";
import { Response } from "./Response";

export class ResponseMapper {
    constructor(private response: ExpressResponse)
    {

    }

    /**
     * Map a response from a domain result
     * @param domainResult The domain result
     */
    fromDomain(domainResult: Either<Failure<any>, any>): Response
    {
        const res = this.getResponseObject();

        if(domainResult.isLeft()) {
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
    fromException(exception: any): Response
    {
        if(!(exception instanceof Error)) {
            return this.getResponseObject()
                .status(500)
                .error('Unknown error', 'Unknown error');            
        }

        if(this.isValidationException(exception)) {
            return new Response(this.response)
                .status(422)
                .addErrors(exception.details.map(error => {
                    return {
                        title: 'Field failed validation: ' + error.type,
                        detail: error.message,
                        source: {
                            pointer: error.context?.label || '',
                        }
                    };
                }));
        }

        return this.getResponseObject()
            .status(500)
            .error(exception.name, exception.message);
    }

    private isValidationException(exception: Error): exception is ValidationError
    {
        return 'isJoi' in exception;
    }

    private getResponseObject(): Response
    {
        return new Response(this.response);
    }
}