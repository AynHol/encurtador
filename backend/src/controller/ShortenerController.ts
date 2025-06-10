import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { shortenService } from "../service/ShortenerService";

export async function shortenerController(app: FastifyInstance) {
    app.post("/shorten", async (request: FastifyRequest, reply: FastifyReply) => {
        const { url } = request.body as { url: string };
        try {
            return await shortenService.register(url);
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
}
