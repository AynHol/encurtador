import { Link } from "@prisma/client";
import { prisma } from "../prisma/client";
import { customAlphabet } from "nanoid";
import QRCode from "qrcode";

class ShortenService {
    public async register({ url, shortId }: { url: string; shortId: string | null }) {
        const generateNanoId = customAlphabet("ABCDEFGHJIKLMNOPQRSTUVWXYZ0123456789", 5);
        const customId = shortId === null ? generateNanoId() : shortId;

        if (shortId !== null) {
            const shortIdExist = await prisma.link.findUnique({ where: { shortId: shortId } });
            if (shortIdExist) {
                throw new Error("Short ID already exists...");
            }
        }

        const link = {
            id: crypto.randomUUID(),
            shortId: customId,
            originalUrl: url,
            createdAt: new Date(),
        } as Link;

        await prisma.link.create({ data: link });

        return { shortId: link.shortId };
    }

    public async findByIdentifier(identifier: string) {
        const link = await prisma.link.findUnique({ where: { shortId: identifier } });
        if (!link) {
            throw new Error("Not found...");
        }

        return { originalUrl: link.originalUrl };
    }

    public async generateQrCode({ url }: { url: string }) {
        if (url === undefined || url === null) {
            throw new Error("Error when generating the QRCODE");
        }

        const base64 = await QRCode.toDataURL(url);
        return { base64 };
    }
}

export const shortenService = new ShortenService();
