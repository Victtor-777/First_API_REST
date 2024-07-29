import fastify from "fastify";
import crypto from "node:crypto";
import { knex } from "./database";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";

const app = fastify();

app.register(cookie);

app.addHook("preHandler", async (request, response) => {
  console.log(`[${request.method}] ${request.url}`);
});

app.register(transactionsRoutes, {
  prefix: "transactions",
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP Server Running");
  });
