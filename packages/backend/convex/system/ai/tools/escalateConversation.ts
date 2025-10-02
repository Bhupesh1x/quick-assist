import { z } from "zod";
import { createTool } from "@convex-dev/agent";

import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const escalateConversation = createTool({
  description: "Escalate an conversation",
  args: z.object({}),
  handler: async (ctx) => {
    if (!ctx?.threadId) {
      return "Thread id is required";
    }

    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "Conversation has been escalated to human operator",
      },
    });

    return "Conversation has been escalated to human operator";
  },
});
