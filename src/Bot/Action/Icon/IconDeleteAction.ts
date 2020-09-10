import { ActionInterface } from '../Action';
import { Either, Failure, right, left } from '../../../Lib/Library';
import { BotError, notConnectedError } from '../../Error';
import { Bot } from '../../Bot';
import { IconDeleteData } from './IconActionTypes';

export default class IconDeleteAction implements ActionInterface<boolean> {
    constructor(
        private readonly bot: Bot,
        private readonly data: IconDeleteData
    ) {}

    /**
     * Execute the action
     */
    async execute(): Promise<Either<Failure<BotError>, boolean>> {
        if (!this.bot.isConnected) return left(notConnectedError());

        const allIcons = await this.bot.getAllIconIds();

        if (!allIcons.includes(this.data.iconId)) return right(true);

        await this.bot.deleteIcon(this.data.iconId);

        return right(true);
    }
}
