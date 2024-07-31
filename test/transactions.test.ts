import { afterAll, beforeAll, it, describe, expect, beforeEach } from "vitest";
import request from "supertest";
import { execSync } from "node:child_process";
import { app } from "../src/app";

describe("Transactions routes", () => {
  beforeAll(async () => {
    execSync("npm run knex migrate:latest");

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("User can create a new transaction", async () => {
    const response = await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "credit",
      })
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie") || [];

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: 5000,
      }),
    ]);
  });
});
