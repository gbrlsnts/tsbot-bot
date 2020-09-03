import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { channelNames } from '../../../Validation/SharedRules';
import { Message } from '../../Message';
import { Bot } from '../../../Bot/Bot';
import { notConnectedError } from '../../../Bot/Error';
import { ChannelUtils } from '../../../Bot/Utils/ChannelUtils';
import { TeamSpeakChannel } from 'ts3-nodejs-library';
import { ValidateChannelUniqueRequest } from './Types';

export class ValidateChannelsUniqueSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.channel.is-unique';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema: Joi.ObjectSchema = Joi.object(channelNames);
    readonly bot: Bot;

    constructor(private manager: Manager) {
        this.bot = manager.bot;
    }

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Joi.ObjectSchema {
        return this.schema;
    }

    async handle(
        msg: Message<ValidateChannelUniqueRequest>
    ): Promise<Either<Failure<any>, any>> {
        const {
            data: { channels, rootChannelId },
        } = msg;

        if (!this.bot.isConnected) return left(notConnectedError());

        if (rootChannelId) {
            const channelList = await this.bot.getServer().channelList();

            return right(
                this.validateSubChannelsUnique(
                    channelList,
                    channels,
                    rootChannelId
                )
            );
        }

        const channelList = await this.bot.getServer().channelList({
            pid: 0,
        });

        return right(this.isNameUnique(channelList, channels));
    }

    private validateSubChannelsUnique(
        channelList: TeamSpeakChannel[],
        names: string[],
        rootChannelId: number
    ): boolean {
        const subChannels = ChannelUtils.getAllSubchannels(
            rootChannelId,
            channelList
        );

        return this.isNameUnique(subChannels, names);
    }

    private isNameUnique(
        channelList: TeamSpeakChannel[],
        names: string[]
    ): boolean {
        return channelList.every(channel => {
            return !names.includes(channel.name);
        });
    }
}
