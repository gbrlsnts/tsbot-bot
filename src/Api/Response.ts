import { Response as ExpressResponse } from "express";

export class Response {
    private contents: any;
    private isError: boolean = false;
    private code = 200;
    private customCode = false;
    private defaultErrorCode = 500;
    private errors: ApiError[] = [];

    constructor(private response: ExpressResponse)
    {

    }

    /**
     * Set the response data
     * @param data Data to send in the response
     */
    data(data: any): this
    {
        this.contents = data;

        return this;
    }

    /**
     * Set the response status code
     * @param code The http code
     */
    status(code: number): this
    {
        this.code = code;
        this.customCode = true;

        return this;
    }

    /**
     * Set the error for the response
     * @param short Short name
     * @param description Error description
     */
    error(short: string, description: string): this
    {
        this.errors.push({ short, description });
        this.isError = true;

        return this;
    }

    /**
     * Add multiple errors to a response
     * @param errors Errors to add
     */
    addErrors(errors: ApiError[])
    {
        this.errors.push(...errors);
    }

    /**
     * Send the response
     */
    send()
    {
        const code = !this.customCode && this.isError ? this.defaultErrorCode : this.code;

        this.response
            .status(code)
            .json(this.formatResponse());
    }

    /**
     * Format the response
     */
    private formatResponse(): ApiResponse
    {
        if(this.isError) {
            return { errors: this.errors };
        }

        return { data: this.contents };
    }

    /**
     * Initialize a success response
     * @param response Express response object
     * @param data Data to send
     */
    static ok(response: ExpressResponse, data: any): Response
    {
        return new Response(response).data(data);
    }

    /**
     * Initialize an error response
     * @param response Express response object
     * @param data Error to send
     */
    static error(response: ExpressResponse, short: string, description: string): Response
    {
        return new Response(response).error(short, description);
    }
}

export interface ApiResponse {
    /**
     * Data to send in the reponse
     */
    data?: any;
    /**
     * Array of Errors
     */
    errors?: ApiError[];
}

export interface ApiError {
    /** Error short name */
    short: string,
    /** Error description */
    description: string
}