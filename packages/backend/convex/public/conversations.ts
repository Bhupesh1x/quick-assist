import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { MessageDoc, saveMessage } from "@convex-dev/agent";

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

export const getMany = query({
  args: {
    contactSessionId: v.id("contactSessions"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession || contactSession?.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_contactSession_id", (q) =>
        q.eq("contactSessionId", args.contactSessionId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const conversationWithLastMessage = await Promise.all(
      conversations?.page?.map(async (conversation) => {
        let lastMessage: MessageDoc | null = null;

        const messages = await supportAgent.listMessages(ctx, {
          threadId: conversation?.threadId,
          paginationOpts: { cursor: null, numItems: 1 },
        });

        if (messages?.page?.length > 0) {
          lastMessage = messages?.page?.[0] ?? null;
        }

        return {
          _id: conversation?._id,
          _creationTime: conversation?._creationTime,
          organizationId: conversation?.organizationId,
          status: conversation?.status,
          threadId: conversation?.threadId,
          lastMessage,
        };
      })
    );

    return {
      ...conversations,
      page: conversationWithLastMessage,
    };
  },
});
