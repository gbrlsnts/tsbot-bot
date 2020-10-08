import Manager from '../../../Bot/Manager';
import {
    SubscriberInterface,
    HandleServerMessagesInterface,
} from '../Interfaces';
import { Either, Failure, left, right } from '../../../Lib/Library';
import { Message } from '../../Message';
import { Bot } from '../../../Bot/Bot';
import { notConnectedError } from '../../../Bot/Error';
import { ClientType } from 'ts3-nodejs-library';
import { TsGroupType, TsGroup } from './Types';
import { tsGroupType } from '../../../Validation/SharedRules';
import { Schema } from '@hapi/joi';

export class GetGroupsSubscriber
    implements SubscriberInterface, HandleServerMessagesInterface {
    readonly subject = 'bot.server.*.server-groups.get';
    readonly serverIdPos = this.subject.split('.').findIndex(f => f === '*');
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

    getValidationSchema(): Schema {
        return tsGroupType;
    }

    async handle(
        msg: Message<TsGroupType>
    ): Promise<Either<Failure<any>, TsGroup[]>> {
        if (!this.bot.isConnected) return left(notConnectedError());

        switch (msg.data) {
            case TsGroupType.SERVER:
                return right(await this.getServerGroups());

            case TsGroupType.CHANNEL:
                return right(await this.getChannelGroups());

            default:
                return right([]);
        }
    }

    async getServerGroups(): Promise<TsGroup[]> {
        const groups = await this.bot.getServer().serverGroupList({
            type: ClientType.ServerQuery,
        });

        return groups.map(g => ({
            tsId: g.sgid,
            iconId: this.normalizeIconId(g.iconid),
            name: g.name,
        }));
    }

    async getChannelGroups(): Promise<TsGroup[]> {
        const groups = await this.bot.getServer().channelGroupList({
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
