import { ConvexError, v } from "convex/values";

import { mutation, query } from "../_generated/server";

export const create = mutation({
  args: {
    organizationId: v.string(),
    sessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);

    if (!session || session?.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "Unauthorized",
        message: "Invalid session",
      });
    }

    // TODO: Update this
    const threadId = "123";

    const conversationId = await ctx.db.insert("conversations", {
      contactSessionId: session?._id,
      organizationId: args.organizationId,
      status: "unresolved",
      threadId,
    });

    return conversationId;
  },
});

export const getOne = query({
  args: {
    sessionId: v.id("contactSessions"),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);

    if (!session || session?.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "Unauthorized",
        message: "Invalid session",
      });
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      return null;
    }

    return {
      _id: conversation._id,
      status: conversation.status,
      threadId: conversation.threadId,
    };
  },
});
