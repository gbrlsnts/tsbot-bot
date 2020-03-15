"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const farmhash = __importStar(require("farmhash"));
class File {
    static calculateNumberChecksum(buffer) {
        const hash = crypto_1.createHash('md5')
            .update(buffer.toString())
            .digest('hex');
        return farmhash.hash32(hash);
    }
}
exports.default = File;
//# sourceMappingURL=File.js.map