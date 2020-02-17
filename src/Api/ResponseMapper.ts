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
        const res = this.getResponseObject().status(500);

        if(exception instanceof Error) {
            return res.error(exception.name, exception.message);
        }

        return res.error('Unknown error', 'Unknown error');
    }

    private getResponseObject(): Response
    {
        return new Response(this.response);
    }
}