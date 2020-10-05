import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { Message } from '../../Message';
import { Bot } from '../../../Bot/Bot';
import { getZoneRequest } from '../../../Validation/UserChannel/UserChannelValidationRules';
import { notConnectedError } from '../../../Bot/Error';
import { GetChannelZoneRequest } from './Types';
import { ChannelUtils } from '../../../Bot/Utils/ChannelUtils';
import { TeamSpeakChannel } from 'ts3-nodejs-library';

export class GetChannelZoneSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.channel.get-zone';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema = Joi.object(getZoneRequest);
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

    getValidationSchema(): Joi.Schema {
        return this.schema;
    }

    async handle(
        msg: Message<GetChannelZoneRequest>
    ): Promise<Either<Failure<any>, any>> {
        if (!this.bot.isConnected) return left(notConnectedError());

        const channelList = await this.bot.getServer().channelList();

        for (const zone of msg.data.zones) {
            const inZone = ChannelUtils.getZoneTopChannels(
                channelList,
                zone.start,
                zone.end,
                zone.separators
            ).applyOnRight(result =>
                this.isInZone(msg.data.channelId, result.channels)
            );

            if (inZone.isLeft()) continue;

            if (inZone.value) return right(zone.id);
        }

        return right(undefined);
    }

    private isInZone(
        channelId: number,
        channelList: TeamSpeakChannel[]
    ): boolean {
        return channelList.findIndex(c => c.cid === channelId) >= 0;
    }
}
