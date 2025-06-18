import { prisma } from "../src/prisma/client";
import { shortenService } from "../src/service/ShortenerService";

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
            },
        },
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
});
