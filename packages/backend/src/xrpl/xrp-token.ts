import { Item } from "@prisma/client";
import { AccountNFToken, convertStringToHex } from "xrpl";

type XRPTokenData = {
    id?: string;
    name: string;
    description: string;
    image: URL | string;
}

export class XRPToken {
    private readonly tokenData: XRPTokenData;

    constructor(
        public data: Omit<XRPTokenData, 'id'> | AccountNFToken | Item
    ) {
        if (this.isItem(data)) {
            this.tokenData = {
                id: data.xrp_id ?? undefined,
                name: data.name,
                description: data.description,
                image: data.image,
            }
            return;
        }

        if (this.isTokenData(data)) {
            this.tokenData = data;
            return;
        }

        const accountNFToken = data as AccountNFToken;

        try {
            const tokenData = JSON.parse(accountNFToken.URI!);

            // Check required fields exist with correct types
            if (!tokenData.name || typeof tokenData.name !== 'string') throw new Error('Invalid name');
            if (!tokenData.description || typeof tokenData.description !== 'string') throw new Error('Invalid description');
            if (!tokenData.image || typeof tokenData.image !== 'string') throw new Error('Invalid image');

            // Basic image format validation
            if (tokenData.image.startsWith('http') || tokenData.image.startsWith('data:image')) {
                this.tokenData = {
                    id: accountNFToken.NFTokenID,
                    name: tokenData.name,
                    description: tokenData.description,
                    image: tokenData.image,
                }
            } else {
                throw new Error('Image must be URL or base64 data');
            }
        } catch (error) {
            throw error instanceof SyntaxError ? new Error('Invalid JSON') : error;
        }
    }

    private isTokenData(data: any): data is XRPTokenData {
        return 'name' in data && 'description' in data && 'image' in data;
    }

    private isItem(data: any): data is Item {
        return 'xrp_id' in data && 'owner_id' in data;
    }

    public mapToItem(): Omit<Item, 'id' | 'owner_id'> {
        return {
            xrp_id: this.tokenData.id ?? null,
            name: this.tokenData.name,
            description: this.tokenData.description,
            image: this.tokenData.image.toString(),
        }
    }
    public encode() {
        return convertStringToHex(JSON.stringify(this));
    }

    public getName() {
        return this.tokenData.name;
    }

    public getDescription() {
        return this.tokenData.description;
    }

    public getImage() {
        return this.tokenData.image;
    }

    public getId() {
        return this.tokenData.id;
    }
}
