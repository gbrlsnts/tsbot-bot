"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
class IconDeleteAction {
    constructor(bot, data) {
        this.bot = bot;
        this.data = data;
    }
    /**
     * Execute the action
     */
    async execute() {
        await this.bot.deleteIcon(this.data.iconId);
        return Library_1.right(true);
    }
}
exports.default = IconDeleteAction;
//# sourceMappingURL=IconDeleteAction.js.map