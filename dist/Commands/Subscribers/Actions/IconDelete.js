"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
const SharedRules_1 = require("../../../Validation/SharedRules");
const IconDeleteAction_1 = __importDefault(require("../../../Bot/Action/Icon/IconDeleteAction"));
class IconDeleteSubscriber {
    constructor() {
        this.subject = 'bot.server.*.icon.delete';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.schema = SharedRules_1.iconIds;
    }
    getServerIdPosition() {
        return this.serverIdPos;
    }
    getSubject() {
        return this.subject;
    }
    getValidationSchema() {
        return this.schema;
    }
    async handle(botManager, msg) {
        const result = await Promise.all(msg.data.map(iconId => {
            return new IconDeleteAction_1.default(botManager.bot, {
                iconId,
            }).execute();
        }));
        const errors = [];
        result.forEach(res => {
            if (res.isLeft())
                errors.push(res.value);
        });
        if (errors.length > 0)
            return Library_1.left({
                type: errors.map(e => e.type).join(','),
                reason: errors.map(e => e.reason).join(','),
            });
        return Library_1.right(true);
    }
}
exports.IconDeleteSubscriber = IconDeleteSubscriber;
//# sourceMappingURL=IconDelete.js.map