import { prisma } from "../src/prisma/client";
import { shortenService } from "../src/service/ShortenerService";
import QRCode from "qrcode";

jest.mock("nanoid", () => {
    return {
        customAlphabet: jest.fn().mockReturnValue(() => "ABCDE"),
    };
});

jest.mock("../src/prisma/client", () => {
    return {
        prisma: {
            link: {
                create: jest.fn(),
                findUnique: jest.fn()
            },
        },
    };
});

jest.mock("qrcode", () => {
    return {
        toDataURL: jest.fn(),
    };
});

describe("Shortner Service Test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should receive a URL and return a shortId", async () => {
        const result = await shortenService.register({ url: "www.test.com/long-url", shortId: null });

        expect(result).toHaveProperty("shortId");
        expect(result.shortId).toHaveLength(5);
        expect(result).toEqual({ shortId: "ABCDE" });
        expect(prisma.link.create).toHaveBeenCalledTimes(1);
        expect(prisma.link.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    originalUrl: "www.test.com/long-url",
                    shortId: expect.any(String),
                }),
            })
        );
    });

    it("Should receive a URL and a custom shortId and return the custom shortId", async () => {
        const result = await shortenService.register({ url: "www.test.com/long-url", shortId: "thing2" });

        expect(result).toHaveProperty("shortId");
        expect(result).toEqual({ shortId: "thing2" });
        expect(result.shortId).toHaveLength(6);
        expect(prisma.link.create).toHaveBeenCalledTimes(1);
        expect(prisma.link.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    originalUrl: "www.test.com/long-url",
                    shortId: "thing2",
                }),
            })
        );
    });

    it("Should return an error when a shortiId is already used", async () => {
        const mockShortId = "test";

        (prisma.link.findUnique as jest.Mock).mockResolvedValue({
            shortId: mockShortId,
            originalUrl: "www.test.com",
        });

        await expect(shortenService.register({ url: "www.test.com", shortId: mockShortId })).rejects.toThrow("Short ID already exists...");
    });

    it("Should seek a link through existing shortId", async () => {
        const mockShortId = "test";
        const mockOriginalUrl = "www.test.com/test/test2/test3";

        (prisma.link.findUnique as jest.Mock).mockResolvedValue({
            shortId: mockShortId,
            originalUrl: mockOriginalUrl,
        });

        const result = await shortenService.findByIdentifier(mockShortId);

        expect(result).toEqual({ originalUrl: mockOriginalUrl });
        expect(prisma.link.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.link.findUnique).toHaveBeenCalledWith({ where: { shortId: mockShortId } });
    });

    it("Should seek a link for a nonexistent ShortId", async () => {
        const mockShortId = "test";

        (prisma.link.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(shortenService.findByIdentifier(mockShortId)).rejects.toThrow("Not found..");
    });

    it("Should generate a base64 of an informed link", async () => {
        const mockUrl = "https://example.test.com";
        const mockBase64 = "data:image/png;base64,example";

        (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockBase64);

        const result = await shortenService.generateQrCode({ url: mockUrl });

        expect(result).toEqual({ base64: mockBase64 });
        expect(QRCode.toDataURL).toHaveBeenCalledTimes(1);
        expect(QRCode.toDataURL).toHaveBeenCalledWith(mockUrl);
    });

    it("Should generate a Error because the URL is null", async () => {
        await expect(shortenService.generateQrCode({ url: null as any })).rejects.toThrow("Error when generating the QRCODE");
    });
});
