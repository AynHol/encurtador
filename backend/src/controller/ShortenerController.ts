import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { shortenService } from "../service/ShortenerService";

export async function shortenerController(app: FastifyInstance) {
    app.post("/shorten", async (request: FastifyRequest, reply: FastifyReply) => {
        const body = request.body as { url: string; shortId: string | null };
        try {
            return await shortenService.register(body);
        } catch (error: any) {
            return reply.status(404).send({ error: "Not Found" });
        }
    });

    app.get("/shorten", async (request: FastifyRequest, reply: FastifyReply) => {
        const { identifier } = request.query as { identifier: string };
        try {
            return await shortenService.findByIdentifier(identifier);
        } catch (error: any) {
            return reply.status(404).send({ error: "Not Found" });
        }
    });

    app.post("/qr-code", async (request: FastifyRequest, reply: FastifyReply) => {
        const body = request.body as { url: string };
        try {
            return await shortenService.generateQrCode(body);
        } catch (error: any) {
            return reply.status(404).send({ error: "Not Found" });
        }
    });
}
