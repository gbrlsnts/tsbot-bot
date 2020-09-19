export interface VerifyUserData {
    /** The users and tokens to send messages */
    targets: SendVerificationTokenData[];
    /** Template message. Must include {%TOKEN%} to be replaced. */
    template: string;
}

export interface SendVerificationTokenData {
    /** the client Id to send the token */
    clientId: number;
    /** the token to send */
    token: string;
}
