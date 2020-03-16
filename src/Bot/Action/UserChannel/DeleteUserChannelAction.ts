import { TeamSpeakChannel } from "ts3-nodejs-library";
import { ActionInterface } from "../Action";
import { Either, Failure, right, left } from "../../../Lib/Library";
import { BotError, notConnectedError } from "../../Error";
import { Bot } from "../../Bot";
import { DeleteChannelData, ZoneChannel } from "./UserChannelTypes";
import { ChannelAction } from "./ChannelAction";
import { ChannelUtils } from "../../Utils/ChannelUtils";

export class DeleteUserChannelAction extends ChannelAction implements ActionInterface<boolean>
{
    private channelList?: TeamSpeakChannel[];

    constructor(private readonly bot: Bot, private readonly data: DeleteChannelData)
    {
        super();
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
     * Get the channels in the server
     */
    async getChannelList(): Promise<TeamSpeakChannel[]>
    {
        if(this.channelList)
            return this.channelList;

        this.channelList = await this.getBot().getServer().channelList();

        return this.channelList;
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