import { TeamSpeakChannel } from "ts3-nodejs-library";
import { ActionInterface } from "../Action";
import { Either, Failure, right, left } from "../../../Lib/Library";
import { BotError, notConnectedError, invalidChannelError, onlyOneSubchannelError } from "../../Error";
import { Bot } from "../../Bot";
import { DeleteChannelData, ZoneChannel } from "./UserChannelTypes";
import { ChannelAction } from "./ChannelAction";
import { ChannelUtils } from "../../Utils/ChannelUtils";

export class DeleteUserChannelAction extends ChannelAction implements ActionInterface<boolean>
{
    constructor(bot: Bot, private readonly data: DeleteChannelData)
    {
        super(bot);
    }

    /**
     * Delete the channel
     */
    async execute(): Promise<Either<Failure<BotError>, boolean>>
    {
        if(!this.bot.isConnected)
            return left(notConnectedError());

        const failure = await this.validateChannel(this.data.channelId);

        if(failure)
            return left(failure);
        
        await Promise.all([
            this.bot.deleteChannel(this.data.channelId, true),
            this.deleteSeparator(),
        ]);

        return right(true);
    }

    /**
     * Delete the separator of the channel
     */
    async deleteSeparator(): Promise<void>
    {
        if(!this.data.zone.separators)
            return;

        const channelList = await this.getChannelList();
        const index = channelList.findIndex(c => c.cid === this.data.channelId);

        // not found or deleted a subchannel
        if(index < 0 || channelList[index].pid !== 0)
            return;

        // already validated before, zone will always be valid
        const result = ChannelUtils.getZoneTopChannels(
            channelList,
            this.data.zone.start,
            this.data.zone.end,
            true
        );

        if(result.isLeft())
            return;

        const posInZone = result.value.channels.findIndex(c => c.cid === this.data.channelId);

        // first. dont remove spacers
        if(posInZone === 0)
            return;

        // delete spacer before
        await this.bot.deleteChannel(result.value.channels[posInZone - 1].cid, true);
    }

    /**
     * Run aditional validations to delete a channel
     * @param channelId The channel to validate
     */
    async validateChannel(channelId: number): Promise<Failure<BotError> | undefined>
    {
        const failure = await super.validateChannel(channelId);
        
        if(failure)
            return failure;

        const channelList = await this.getChannelList();
        const channel = channelList.find(c => c.cid === channelId);

        // Shouldn't happen has it has been validated by the parent method
        if(!channel)
            return invalidChannelError();

        if(channel.pid !== 0) {
            const root = ChannelUtils.getRootChannelBySubChannel(channel, channelList);

            if(channel.pid === root.cid && ChannelUtils.getAllSubchannels(root, channelList).length === 1)
                return onlyOneSubchannelError();
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
    getData(): ZoneChannel {
        return this.data;
    }
}