import { ConvexError, v } from "convex/values";
import { MessageDoc } from "@convex-dev/agent";
import { paginationOptsValidator, PaginationResult } from "convex/server";

import { query } from "../_generated/server";
import { Doc } from "../_generated/dataModel";

import { supportAgent } from "../system/ai/agents/supportAgent";

export const getMany = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("unresolved"),
        v.literal("escalated"),
        v.literal("resolved")
      )
    ),
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
        code: "BAD_REQUEST",
        message: "Organization not found",
      });
    }

    let conversations: PaginationResult<Doc<"conversations">> | null = null;

    if (args.status) {
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_status_and_organization_id", (q) =>
          q
            .eq(
              "status",
              args.status as "unresolved" | "escalated" | "resolved"
            )
            .eq("organizationId", orgId)
        )
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    const conversationWithAdditionalInfo = await Promise.all(
      conversations?.page?.map(async (conversation) => {
        let lastMessage: MessageDoc | null = null;

        const contactSession = await ctx.db.get(conversation?.contactSessionId);

        if (!contactSession) {
          return null;
        }

        const messages = await supportAgent?.listMessages(ctx, {
          threadId: conversation?.threadId,
          paginationOpts: { cursor: null, numItems: 1 },
        });

        if (messages?.page?.length > 0) {
          lastMessage = messages?.page?.[0] ?? null;
        }

        return {
          ...conversation,
          lastMessage,
          contactSession,
        };
      })
    );

    const validConversations = conversationWithAdditionalInfo?.filter(Boolean);

    return {
      ...conversations,
      page: validConversations,
    };
  },
});

export const getOne = query({
  args: {
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
        code: "NOT_FOUND",
        message: "Organization not found",
      });
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation || conversation?.organizationId !== orgId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    const contactSession = await ctx.db.get(conversation?.contactSessionId);

    if (!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Contact session not found",
      });
    }

    return {
      ...conversation,
      contactSession,
    };
  },
});
