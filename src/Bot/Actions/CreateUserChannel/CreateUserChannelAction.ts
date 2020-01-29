import { ActionInterface } from "../ActionInterface";
import { ActionResult } from "../ActionResult";
import { CreateUserChannelData } from "./CreateUserChannelData";
import { Bot } from "../../Bot";
import { TeamSpeakChannel } from "ts3-nodejs-library";
import { generate } from "randomstring";
import { CreateUserChannelActionResult } from "./CreateUserChannelActionResult";

export class CreateUserChannelAction implements ActionInterface
{
    readonly spacerFormat: string = '[*spacer%d]=';

    constructor(private bot: Bot, readonly data: CreateUserChannelData)
    {
        
    }

    async execute(): Promise<CreateUserChannelActionResult> {
        const channels = await this.createChannelsHierarchy();

        this.setUserChannelAdminGroup(channels);

        return new CreateUserChannelActionResult(channels);
    }

    /**
     * Find the channel where the new channel will be placed after
     */
    private async getChannelToCreateAfter(): Promise<TeamSpeakChannel>
    {
        const channelList = await this.bot.getServer().channelList();

        let hasStart = false,
            hasEnd = false,
            lastChannel;

        for(let channel of channelList) {
            if(channel.pid !== 0) {
                continue;
            }

            if(channel.cid === this.data.userChannelStart) {
                hasStart = true;
            }
                
            if(channel.cid === this.data.userChannelEnd) {
                hasEnd = true;
                break;
            }
                
            if(hasStart) {
                lastChannel = channel;
            }
        }

        if(!hasStart || !hasEnd)
            throw new Error('Start or End delimiter channels don\'t exist');

        if(!lastChannel)
            throw new Error('Unable to determine channel to create new channel after it');

        return lastChannel;
    }

    private async createChannelsHierarchy(): Promise<TeamSpeakChannel[]>
    {
        let spacer: TeamSpeakChannel | null = null, 
            channels: TeamSpeakChannel[] = [];

        try {
            const spacerName = this.getSpacerName();
            let channelBefore = await this.getChannelToCreateAfter();

            if(channelBefore.cid !== this.data.userChannelStart) {
                spacer = await this.bot.createSpacer(spacerName, channelBefore.cid);
                channelBefore = spacer;
            }

            for(let createChannelData of this.data.channels) {
                const channel = await this.bot.createChannel(
                    createChannelData.name,
                    createChannelData.password,
                    undefined,
                    channelBefore.cid
                );

                channels.push(channel);
                channelBefore = channel;

                for(let createSubChannelData of createChannelData.channels) {
                    const subChannel = await this.bot.createChannel(
                        createSubChannelData.name,
                        createSubChannelData.password,
                        channel.cid
                    );

                    channels.push(subChannel);
                }
            }
        } catch(e) {
            const toDelete = channels;

            if(spacer != null)
                toDelete.push(spacer);

            this.cleanUpCreatedChannels(toDelete);
            
            return Promise.reject(new Error(`Error while creating channels: ${e.message}`));
        }

        return channels;
    }
    
    private setUserChannelAdminGroup(channels: TeamSpeakChannel[])
    {
        const owner = this.data.owner,
            group = this.data.channelGroupToAssign;

        if(!owner || !group) {
            return;
        }

        channels.forEach(channel => {
            this.bot.setChannelGroupToClient(owner, channel.cid, group)
                .catch(e => console.log('Warning! Could not set channel group of id ' + group));
        });
    }

    private getSpacerName(): string
    {
        return this.spacerFormat.replace('%d', generate(6));
    }

    private cleanUpCreatedChannels(channels: TeamSpeakChannel[])
    {
        try {
            channels.forEach(c => this.bot.deleteChannel(c.cid, true));
        } catch (e) {
            console.log(`Error cleaning up channels: ${e.message}`);
        }
        
    }
}