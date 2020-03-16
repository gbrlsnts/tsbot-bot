import _ from "lodash";
import { ActionInterface } from "../Action";
import { Either, Failure, left, right } from "../../../Lib/Library";
import { BotError, invalidServerGroupError, invalidClientError } from "../../Error";
import { Bot } from "../../Bot";
import { SetUserGroupsData } from "./SetUserGroupsTypes";
import { Factory } from "./Repository/Factory";
import { RepositoryInterface } from "./Repository/RepositoryInterface";

export default class SetUserGroupsAction implements ActionInterface<boolean>
{
    private readonly repository: RepositoryInterface;

    constructor(private readonly bot: Bot, private readonly data: SetUserGroupsData)
    {
        this.repository = new Factory().create();
    }

    /**
     * Execute the action
     */
    async execute(): Promise<Either<Failure<BotError>, boolean>> {
        const allowedGroups = await this.repository.getUserGroups();

        if(!this.validateGroups(allowedGroups))
            return left(invalidServerGroupError());

        const client = await this.bot.getClientByDatabaseId(this.data.clientDatabaseId);

        if(!client)
            return left(invalidClientError());

        const { toAdd, toRemove } = this.getGroupsToChange(client.servergroups || [], allowedGroups);

        await Promise.all([
            this.bot.clientAddServerGroups(client.databaseId, toAdd),
            this.bot.clientRemoveServerGroups(client.databaseId, toRemove)
        ]);

        return right(true);
    }

    /**
     * Validate if all groups are allowed
     */
    private validateGroups(allowedGroups: number[]): boolean {
        return this.data.groups.every(group => {
            return allowedGroups.findIndex(allowed => allowed === group) >= 0;
        });
    }

    /**
     * Retrieve the groups to add and remove of a client
     * @param clientGroups current groups of the client
     */
    private getGroupsToChange(clientGroups: number[], allowedGroups: number[]): { toAdd: number[], toRemove: number[] }
    {
        const clientAllowedGroups = _.intersection(clientGroups, allowedGroups);

        const toAdd = _.difference(this.data.groups, clientAllowedGroups);
        const toRemove = _.difference(clientAllowedGroups, this.data.groups);

        return {
            toAdd,
            toRemove,
        };
    }
}