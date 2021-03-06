import { ActionInterface } from '../Action';
import { BotError, notConnectedError } from '../../Error';
import { Either, Failure, right, left } from '../../../Lib/Library';
import {
    CreateUserSubChannelResultData,
    CreateSubChannelData,
    CreateChannelData,
} from './UserChannelTypes';
import { Bot } from '../../Bot';
import { CreateChannelAction } from './CreateChannelAction';
import Logger from '../../../Log/Logger';

export class CreateUserSubChannelAction
    extends CreateChannelAction
    implements ActionInterface<CreateUserSubChannelResultData> {
    constructor(
        logger: Logger,
        bot: Bot,
        private readonly data: CreateSubChannelData
    ) {
        super(logger, bot);
    }

    /**
     * Create the user sub channel
     */
    async execute(): Promise<
        Either<Failure<BotError>, CreateUserSubChannelResultData>
    > {
        if (!this.bot.isConnected) return left(notConnectedError());

        const failure =
            (await this.validateAction(this.data.rootChannelId)) ||
            (await this.validateChannel(this.data.rootChannelId));

        if (failure) return left(failure);

        await this.createSubChannel();
        this.setUserChannelAdminGroup(this.getCreatedChannels());

        return right({
            channels: this.getCreatedChannels().map(channel => channel.cid),
        });
    }

    /**
     * Create sub channels in the request
     */
    async createSubChannel() {
        try {
            for (const config of this.data.channels) {
                await this.createUserChannel({
                    config,
                    parent: this.data.rootChannelId,
                });
            }
        } catch (e) {
            this.cleanUpCreatedChannels(this.getCreatedChannels());

            return Promise.reject(
                new Error(`Error while creating channels: ${e.message}`)
            );
        }
    }

    /**
     * Get the server bot instance
     */
    getBot(): Bot {
        return this.bot;
    }

    /**
     * Get the action data
     */
    getData(): CreateChannelData {
        return this.data;
    }
}
