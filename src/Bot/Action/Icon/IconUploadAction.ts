import { ActionInterface } from '../Action';
import { Either, Failure, right, left } from '../../../Lib/Library';
import { BotError, notConnectedError } from '../../Error';
import { Bot } from '../../Bot';
import { IconUploadData } from './IconActionTypes';

export default class IconUploadAction implements ActionInterface<number> {
    constructor(
        private readonly bot: Bot,
        private readonly data: IconUploadData
    ) {}

    /**
     * Execute the action
     */
    async execute(): Promise<Either<Failure<BotError>, number>> {
        if (!this.bot.isConnected) return left(notConnectedError());

        const iconId = await this.bot.uploadIcon(this.data.icon);

        return right(iconId);
    }
}
