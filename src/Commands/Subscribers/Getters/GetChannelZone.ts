import Joi from '@hapi/joi';
import Manager from '../../../Bot/Manager';
import { SubscribesServerMessages } from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { Message } from '../../Message';
import { getZoneRequest } from '../../../Validation/UserChannel/UserChannelValidationRules';
import { notConnectedError } from '../../../Bot/Error';
import { GetChannelZoneRequest, GetChannelZoneResponse } from './Types';
import { ChannelUtils } from '../../../Bot/Utils/ChannelUtils';
import { TeamSpeakChannel } from 'ts3-nodejs-library';

export class GetChannelZoneSubscriber implements SubscribesServerMessages {
    readonly subject = 'bot.server.*.channel.get-zone';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    readonly schema = Joi.object(getZoneRequest);

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
        botManager: Manager,
        msg: Message<GetChannelZoneRequest>
    ): Promise<Either<Failure<any>, GetChannelZoneResponse>> {
        if (!botManager.bot.isConnected) return left(notConnectedError());

        const channelList = await botManager.bot.getServer().channelList();

        for (const zone of msg.data.zones) {
            const inZone = ChannelUtils.getZoneTopChannels(
                channelList,
                zone.start,
                zone.end,
                zone.separators
            ).applyOnRight(result =>
                this.channelExists(msg.data.channelId, result.channels)
            );

            if (inZone.isLeft()) continue;

            if (inZone.value) return right({ zoneId: zone.id });
        }

        let existsOutOfZone = false;
        if (this.channelExists(msg.data.channelId, channelList))
            existsOutOfZone = true;

        return right({ existsOutOfZone });
    }

    private channelExists(
        channelId: number,
        channelList: TeamSpeakChannel[]
    ): boolean {
        return channelList.findIndex(c => c.cid === channelId) >= 0;
    }
}
