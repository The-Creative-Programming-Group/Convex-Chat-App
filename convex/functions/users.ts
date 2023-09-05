import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

import type { Infer } from "convex/values";

type User = {
  _id: string;
  name: string;
};

export const get = query<Promise<User[]>>({
  handler: async (ctx) => {
    const data = await ctx.db.query<"users">("users").collect();
    return data.map((d) => ({
      _id: d._id,
      name: d.name,
    }));
  },
});

const postArgsValidator = v.object({
  name: v.string(),
});

type PostArgs = Infer<typeof postArgsValidator>;

/// TODO: replace with a real auth system
export const post = mutation({
  handler: async (ctx, args: PostArgs) => {
    const name = args.name;

    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), name))
      .unique();

    if (existingUser) {
      return existingUser;
    }

    const data = await ctx.db.insert("users", {
      name: name,
    });
    return data;
  },
});
