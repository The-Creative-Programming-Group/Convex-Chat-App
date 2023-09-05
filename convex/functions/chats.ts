import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

import type { Id } from "../_generated/dataModel";
import type { Infer } from "convex/values";

type Chat = {
  _id: string;
  text: string;
  user: string;
};

export const get = query<Promise<Chat[]>>({
  handler: async (ctx) => {
    const data = await ctx.db.query<"chat">("chat").collect();
    const users = await ctx.db.query<"users">("users").collect();
    return data.map((d) => ({
      _id: d._id,
      text: d.text,
      user: users.find((u) => u._id === d.user)?.name || "Unknown user",
    }));
  },
});

const postArgsValidator = v.object({
  body: v.string(),
  user: v.string(),
});

type PostArgs = Infer<typeof postArgsValidator>;

export const post = mutation({
  handler: async (ctx, args: PostArgs) => {
    const message = args.body;

    const userName = args.user as Id<"users">;

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), userName))
      .unique();

    if (user) {
      const data = await ctx.db.insert("chat", {
        text: message,
        user: user?._id,
      });

      return data;
    }

    throw new Error("User not found");
  },
});
