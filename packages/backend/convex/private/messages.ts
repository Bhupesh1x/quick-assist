import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

import { components, internal } from "../_generated/api";
import { action, mutation, query } from "../_generated/server";

import { supportAgent } from "../system/ai/agents/supportAgent";
import { saveMessage } from "@convex-dev/agent";

export const create = mutation({
  args: {
    prompt: v.string(),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const orgId = identity?.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization id is required",
      });
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation || conversation?.organizationId !== orgId) {
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

    await saveMessage(ctx, components.agent, {
      threadId: conversation.threadId,
      agentName: identity.familyName || "",
      message: {
        role: "assistant",
        content: args.prompt,
      },
    });
  },
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const orgId = identity?.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization id is required",
      });
    }

    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();

    if (!conversation || conversation?.organizationId !== orgId) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Invalid organization id",
      });
    }

    const paginatedItems = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });

    return paginatedItems;
  },
});
