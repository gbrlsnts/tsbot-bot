"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
class Bot {
    constructor(server) {
        this.server = server;
    }
    whoami() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.whoami();
        });
    }
    sendServerMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.server.sendTextMessage(0, ts3_nodejs_library_1.TextMessageTargetMode.SERVER, message);
            }
            catch (error) {
                console.log('Got error', error);
            }
        });
    }
}
exports.Bot = Bot;
//# sourceMappingURL=Bot.js.map