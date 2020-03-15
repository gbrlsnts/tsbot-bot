import { ActionInterface } from "../Action";
import { Either, Failure, right } from "../../../Lib/Library";
import { BotError } from "../../Error";
import { Bot } from "../../Bot";
import { IconDeleteData } from "./IconActionTypes";

export default class IconDeleteAction implements ActionInterface<boolean>
{
    constructor(private readonly bot: Bot, private readonly data: IconDeleteData)
    {

    }

    /**
     * Execute the action
     */
    async execute(): Promise<Either<Failure<BotError>, boolean>> {
        await this.bot.deleteIcon(this.data.iconId);

        return right(true);
    }

}