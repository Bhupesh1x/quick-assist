import { ConvexError, v } from "convex/values";
import { saveMessage } from "@convex-dev/agent";

import { components } from "../_generated/api";
import { mutation, query } from "../_generated/server";

import { supportAgent } from "../system/ai/agents/supportAgent";

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

    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.organizationId,
    });

    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: "assistant",
        content: "Hello, how can i help you today?",
      },
    });

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
      throw new ConvexError({
        code: "Not found",
        message: "Conversation not found",
      });
    }

    if (conversation?.contactSessionId !== session?._id) {
      throw new ConvexError({
        code: "Unauthorized",
        message: "Incorrect session",
      });
    }

    return {
      _id: conversation._id,
      status: conversation.status,
      threadId: conversation.threadId,
    };
  },
});
