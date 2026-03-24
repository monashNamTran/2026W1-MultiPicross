import { Hono } from "hono";
import { db } from "../db/index.js";
import { todos as todosTable } from "../db/schema.js";

import { eq } from "drizzle-orm"; // added


const todos = new Hono();

todos.get("/", async (c) => {
  const allTodos = await db.select().from(todosTable);
  return c.json(allTodos);
});



todos.post("/", async (c) => {
  const body = await c.req.json(); // get the request in json format
  const { title } = body; // just get the title
 
  if (!title || typeof title !== "string") { // if title doesn't exist or title is not string
    return c.json({ error: "title is required and must be a string" }, 400);
  }
 
  const [newTodo] = await db 
    .insert(todosTable)
    .values({ title }) 
    .returning(); // show whole row
 
  return c.json(newTodo, 201);
});

todos.delete("/:id", async (c) => {
  const id = Number(c.req.param("id")); // get id from parameter

  if (isNaN(id)) { // is a number
    return c.json({ error: "id must be a number" }, 400);
  }

  const [deleted] = await db
    .delete(todosTable)
    .where(eq(todosTable.id, id))
    .returning();

  if (!deleted) {
    return c.json({ error: "todo not found" }, 404);
  }

  return c.json(deleted);
});

todos.patch("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "id must be a number" }, 400);
  }

  const body = await c.req.json();
  const { title, completed } = body;

  const updates: { title?: string; completed?: boolean } = {};
  if (title !== undefined) updates.title = title;
  if (completed !== undefined) updates.completed = completed;

  if (Object.keys(updates).length === 0) {
    return c.json({ error: "no valid fields to update" }, 400);
  }

  const [updated] = await db
    .update(todosTable)
    .set(updates)
    .where(eq(todosTable.id, id))
    .returning();

  if (!updated) {
    return c.json({ error: "todo not found" }, 404);
  }

  return c.json(updated);
});

export default todos;
