import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

import { internal } from "../_generated/api";
import { action, query } from "../_generated/server";

import { supportAgent } from "../system/ai/agents/supportAgent";

export const create = action({
  args: {
    prompt: v.string(),
    sessionId: v.id("contactSessions"),
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.runQuery(internal.system.contactSessions.getOne, {
      sessionId: args.sessionId,
    });

    if (!session || session?.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "Unauthorized",
        message: "Session not valid",
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: args.threadId,
      }
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation?.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation already resolved",
      });
    }

    await supportAgent.generateText(
      ctx,
      {
        threadId: args.threadId,
      },
      { prompt: args.prompt }
    );
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
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

    const paginatedItems = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    return paginatedItems;
  },
});
