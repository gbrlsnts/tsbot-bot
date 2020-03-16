"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
const Error_1 = require("../../Error");
class IconDeleteAction {
    constructor(bot, data) {
        this.bot = bot;
        this.data = data;
    }
    /**
     * Execute the action
     */
    async execute() {
        if (!this.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
        await this.bot.deleteIcon(this.data.iconId);
        return Library_1.right(true);
    }
}
exports.default = IconDeleteAction;
//# sourceMappingURL=IconDeleteAction.js.map