import { ConvexError, v } from "convex/values";
import { saveMessage } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";

import { action, query } from "../_generated/server";
import { components, internal } from "../_generated/api";

import { supportAgent } from "../system/ai/agents/supportAgent";
import { resolveConversation } from "../system/ai/tools/resolveConversation";
import { escalateConversation } from "../system/ai/tools/escalateConversation";

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

    const shouldGenerateText = conversation?.status === "unresolved";

    if (shouldGenerateText) {
      await supportAgent.generateText(
        ctx,
        {
          threadId: args.threadId,
        },
        {
          prompt: args.prompt,
          tools: {
            escalateConversation,
            resolveConversation,
          },
        }
      );
    } else {
      await saveMessage(ctx, components.agent, {
        threadId: args.threadId,
        prompt: args.prompt,
      });
    }
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
