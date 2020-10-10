import Manager from '../../../Bot/Manager';
import { SubscribesServerMessages } from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { Message } from '../../Message';
import { notConnectedError } from '../../../Bot/Error';
import { ClientType } from 'ts3-nodejs-library';
import { TsGroupType, TsGroup } from './Types';
import { tsGroupType } from '../../../Validation/SharedRules';
import { Schema } from '@hapi/joi';

export class GetGroupsSubscriber implements SubscribesServerMessages {
    readonly subject = 'bot.server.*.server-groups.get';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');

    getServerIdPosition(): number {
        return this.serverIdPos;
    }

    getSubject(): string {
        return this.subject;
    }

    getValidationSchema(): Schema {
        return tsGroupType;
    }

    async handle(
        botManager: Manager,
        msg: Message<TsGroupType>
    ): Promise<Either<Failure<any>, TsGroup[]>> {
        if (!botManager.bot.isConnected) return left(notConnectedError());

        switch (msg.data) {
            case TsGroupType.SERVER:
                return right(await this.getServerGroups(botManager));

            case TsGroupType.CHANNEL:
                return right(await this.getChannelGroups(botManager));

            default:
                return right([]);
        }
    }

    async getServerGroups(botManager: Manager): Promise<TsGroup[]> {
        const groups = await botManager.bot.getServer().serverGroupList({
            type: ClientType.ServerQuery,
        });

        return groups.map(g => ({
            tsId: g.sgid,
            iconId: this.normalizeIconId(g.iconid),
            name: g.name,
        }));
    }

    async getChannelGroups(botManager: Manager): Promise<TsGroup[]> {
        const groups = await botManager.bot.getServer().channelGroupList({
            type: ClientType.ServerQuery,
        });

        return groups.map(g => ({
            tsId: g.cgid,
            iconId: this.normalizeIconId(g.iconid),
            name: g.name,
        }));
    }

    normalizeIconId(id: number): number | undefined {
        // 0xf: fix bug with teamspeak icon IDs being negative
        return id !== 0 ? id >>> 0 : undefined;
    }
}
