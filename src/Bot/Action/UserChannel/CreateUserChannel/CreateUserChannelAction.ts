import { generate } from "randomstring";
import { TeamSpeakChannel } from "ts3-nodejs-library";
import { ActionInterface } from "../../Action";
import { Bot } from "../../../Bot";
import { ChannelUtils, ZoneChannelsResult } from "../../../Utils/ChannelUtils";
import { Either, right, left } from "../../../../Lib/Either";
import { Failure } from "../../../../Lib/Failure";
import { BotError, invalidZoneError } from "../../../Error";
import { CreateUserChannelData, CreateUserChannelResultData, UserChannelConfiguration, ChannelProperties, CreateChannelData } from "../UserChannelTypes";
import { CreateChannelAction } from "../CreateChannelAction";

export class CreateUserChannelAction extends CreateChannelAction implements ActionInterface<CreateUserChannelResultData>
{
    private channelList?: TeamSpeakChannel[];
    readonly spacerFormat: string = '[*spacer%d]=';
    
    constructor(private bot: Bot, readonly data: CreateUserChannelData)
    {
        super();
    }

    /**
     * Execute the action
     */
    async execute(): Promise<Either<Failure<BotError>, CreateUserChannelResultData>> {
        const zoneChannels = await this.getUserChannelZone(await this.getChannelList());

        // zone is invalid
        if(zoneChannels.isLeft()) {
            return left(invalidZoneError());
        }

        const userChannels = await this.createChannelsHierarchy(
            zoneChannels.value.channels.pop() || zoneChannels.value.start
        );

        this.setUserChannelAdminGroup(userChannels);

        return this.getResultData(userChannels);
    }

    /**
     * Create a user channel hierarchy (top and subchannels)
     * @param createAfterChannel The new channel will be placed after this channel
     */
    private async createChannelsHierarchy(createAfterChannel: TeamSpeakChannel): Promise<TeamSpeakChannel[]>
    {
        let spacer: TeamSpeakChannel | undefined;

        try {
            const spacerName = this.getSpacerName();
            let channelBefore = createAfterChannel;

            if(this.data.zone.separators && channelBefore.cid !== this.data.zone.start) {
                spacer = await this.bot.createSpacer(spacerName, channelBefore.cid);
                channelBefore = spacer;
            }

            for(const config of this.data.channels) {
                const result = await this.createUserChannel({ config, after: channelBefore.cid });
                channelBefore = result.channel;
            }
        } catch(e) {
            this.cleanUpCreatedChannels(spacer ? [spacer, ...this.getCreatedChannels()] : this.getCreatedChannels());
            
            return Promise.reject(new Error(`Error while creating channels: ${e.message}`));
        }

        return this.getCreatedChannels();
    }

    /**
     * Get the spacer name for the separator
     */
    private getSpacerName(): string
    {
        return this.spacerFormat.replace('%d', generate(6));
    }

    /**
     * Get the result data
     */
    private getResultData(channelList: TeamSpeakChannel[]): Either<Failure<BotError>, CreateUserChannelResultData>
    {
        const channel = channelList[0].cid;
        const subchannels = channelList.slice(1).map(c => c.cid);

        return right({
            channel,
            subchannels,
        });
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
    getData(): CreateChannelData {
        return this.data;
    }
}