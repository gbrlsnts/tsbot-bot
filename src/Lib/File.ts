import { createHash } from "crypto";
import * as farmhash from "farmhash";

export default class File
{
    static calculateNumberChecksum(buffer: Buffer): number
    {
        const hash = createHash('md5')
            .update(buffer.toString())
            .digest('hex');

        return farmhash.hash32(hash);
    }
}