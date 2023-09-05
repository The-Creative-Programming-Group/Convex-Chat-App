import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chat: defineTable({
    text: v.string(),
    user: v.id("users"),
  }),
  users: defineTable({
    name: v.string(),
  }),
});
