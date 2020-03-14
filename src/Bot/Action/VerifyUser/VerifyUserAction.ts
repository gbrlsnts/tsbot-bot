import { ActionInterface } from "../Action";
import { Either, right, left } from "../../../Lib/Either";
import { Failure } from "../../../Lib/Failure";
import { BotError, genericBotError } from "../../Error";
import { Bot } from "../../Bot";
import { VerifyUserData } from "./VerifyUserTypes";

export default class VerifyUserAction implements ActionInterface<boolean>
{
    constructor(private readonly bot: Bot, private readonly data: VerifyUserData)
    {

    }

    async execute(): Promise<Either<Failure<BotError>, boolean>> {

        try {
            await Promise.all(
                this.data.targets.map(target => this.bot.sendClientMessage(target.clientId, this.formatClientMessage(target.token)))
            );
        } catch(e) {
            return left(genericBotError());
        }

        return right(true);
    }

    private formatClientMessage(token: string): string
    {
        return '\n[color=green][b]Verification Token[/b][/color]\n\n' +
                'Please use this token to get [b]verified[/b] in our website:\n---------\n' + 
                `${token}\n---------\n` +
                '[color=red]Please ignore if you aren\'t trying to verify your account. [b]Do not give to anyone![/b][/color]';
    }
}