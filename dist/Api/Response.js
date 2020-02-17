"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(response) {
        this.response = response;
        this.isError = false;
        this.code = 200;
        this.customCode = false;
        this.defaultErrorCode = 500;
        this.errors = [];
    }
    /**
     * Set the response data
     * @param data Data to send in the response
     */
    data(data) {
        this.contents = data;
        return this;
    }
    /**
     * Set the response status code
     * @param code The http code
     */
    status(code) {
        this.code = code;
        this.customCode = true;
        return this;
    }
    /**
     * Set the error for the response
     * @param short Short name
     * @param description Error description
     */
    error(short, description) {
        this.errors.push({ short, description });
        this.isError = true;
        return this;
    }
    /**
     * Add multiple errors to a response
     * @param errors Errors to add
     */
    addErrors(errors) {
        this.errors.push(...errors);
    }
    /**
     * Send the response
     */
    send() {
        const code = !this.customCode && this.isError ? this.defaultErrorCode : this.code;
        this.response
            .status(code)
            .json(this.formatResponse());
    }
    /**
     * Format the response
     */
    formatResponse() {
        if (this.isError) {
            return { errors: this.errors };
        }
        return { data: this.contents };
    }
    /**
     * Initialize a success response
     * @param response Express response object
     * @param data Data to send
     */
    static ok(response, data) {
        return new Response(response).data(data);
    }
    /**
     * Initialize an error response
     * @param response Express response object
     * @param data Error to send
     */
    static error(response, short, description) {
        return new Response(response).error(short, description);
    }
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map