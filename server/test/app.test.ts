import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { TaskStore } from "../src/store.js";

describe("task API", () => {
  it("reports health", async () => {
    const res = await request(createApp()).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("creates, lists, toggles, and deletes a task", async () => {
    const app = createApp(new TaskStore());

    const created = await request(app).post("/api/tasks").send({ title: "Write tests" });
    expect(created.status).toBe(201);
    expect(created.body.title).toBe("Write tests");
    expect(created.body.done).toBe(false);
    const id = created.body.id;

    const listed = await request(app).get("/api/tasks");
    expect(listed.status).toBe(200);
    expect(listed.body).toHaveLength(1);

    const toggled = await request(app).patch(`/api/tasks/${id}`);
    expect(toggled.status).toBe(200);
    expect(toggled.body.done).toBe(true);

    const removed = await request(app).delete(`/api/tasks/${id}`);
    expect(removed.status).toBe(204);

    const empty = await request(app).get("/api/tasks");
    expect(empty.body).toHaveLength(0);
  });

  it("rejects an empty title", async () => {
    const res = await request(createApp()).post("/api/tasks").send({ title: "  " });
    expect(res.status).toBe(400);
  });
});
