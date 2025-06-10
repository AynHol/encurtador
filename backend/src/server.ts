import fastify from "fastify";
import cors from "@fastify/cors";
import { shortenerController } from "./controller/ShortenerController";

const app = fastify();
const PORT = 5500;

app.register(cors, {
    origin: true,
    methods: ["GET", "POST"],
});

app.register(shortenerController);

app.listen({ port: PORT }).then(() => {
    console.log(`Backend rodando na porta ${PORT}!!!`);
});
