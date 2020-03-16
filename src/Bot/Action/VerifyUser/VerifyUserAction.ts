import { ActionInterface } from "../Action";
import { Either, right, left } from "../../../Lib/Either";
import { Failure } from "../../../Lib/Failure";
import { BotError, genericBotError, notConnectedError } from "../../Error";
import { Bot } from "../../Bot";
import { VerifyUserData } from "./VerifyUserTypes";

export default class VerifyUserAction implements ActionInterface<boolean>
{
    constructor(private readonly bot: Bot, private readonly data: VerifyUserData)
    {

    }

    /**
     * Execute the action
     */
    async execute(): Promise<Either<Failure<BotError>, boolean>>
    {
        if(!this.bot.isConnected)
            return left(notConnectedError());

        try {
            await Promise.all(
                this.data.targets.map(target => this.bot.sendClientMessage(target.clientId, this.formatClientMessage(target.token)))
            );
        } catch(e) {
            return left(genericBotError());
        }

        return right(true);
    }

    /**
     * Format the message to send to the client
     * @param token Token to add to the message
     */
    private formatClientMessage(token: string): string
    {
        return '\n[color=green][b]Verification Token[/b][/color]\n\n' +
                'Please use this token to get [b]verified[/b] in our website:\n---------\n' + 
                `${token}\n---------\n` +
                '[color=red]Please ignore if you aren\'t trying to verify your account. [b]Do not give to anyone![/b][/color]';
    }
}