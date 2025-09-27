import { ConvexError, v } from "convex/values";

import { mutation } from "../_generated/server";

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
