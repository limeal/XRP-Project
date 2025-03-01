import { convertStringToHex } from "xrpl";

export class XRPToken {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly image: URL | string,
    ) {}

    toHex() {
        return convertStringToHex(JSON.stringify(this));
    }
}