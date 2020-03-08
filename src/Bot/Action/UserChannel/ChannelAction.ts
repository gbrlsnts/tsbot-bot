import { Failure, Either } from "../../../Lib/Library";
import { BotError, invalidZoneError, invalidChannelZoneError, invalidChannelError } from "../../Error";
import { ZoneChannelsResult, ChannelUtils } from "../../Utils/ChannelUtils";
import { Bot } from "../../Bot";
import { ZoneChannel } from "./UserChannelTypes";
import { TeamSpeakChannel } from "ts3-nodejs-library";

export abstract class ChannelAction
{
    /**
     * Get the channels in the zone to creat the user channel
     */
    protected async getUserChannelZone(channelList: TeamSpeakChannel[]): Promise<Either<Failure<BotError>, ZoneChannelsResult>>
    {
        const data = this.getData();

        return ChannelUtils.getZoneTopChannels(
            channelList,
            data.zone.start,
            data.zone.end
        );
    }

    /**
     * Validates that the given channel Id exists in the zone
     */
    async validateChannel(channelId: number): Promise<Failure<BotError> | undefined>
    {
        const channelList = await this.getChannelList();
        const channel = channelList.find(c => c.cid === channelId);

        // channel doesnt exist in the server
        if(!channel)
            return invalidChannelError();

        const rootChannel = ChannelUtils.getRootChannelBySubChannel(channel, channelList);

        const zoneIndex = (await this.getUserChannelZone(channelList))
            .applyOnRight(result => result.channels.findIndex(c => c.cid === rootChannel.cid));

        // zone is invalid
        if(zoneIndex.isLeft())
            return invalidZoneError();

        // channel doesnt exist in zone
        if(zoneIndex.value < 0)
            return invalidChannelZoneError();
    }

    /**
     * Get the channels in the server
     */
    abstract getChannelList(): Promise<TeamSpeakChannel[]>;

    /**
     * Get the server bot instance
     */
    abstract getBot(): Bot;

    /**
     * Get the action data
     */
    abstract getData(): ZoneChannel;
}