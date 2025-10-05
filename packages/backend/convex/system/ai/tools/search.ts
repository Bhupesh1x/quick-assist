import { z } from "zod";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { createTool } from "@convex-dev/agent";

import { rag } from "../rag";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";
import { SEARCH_INTERPRETER_PROMPT } from "../../constants";

export const search = createTool({
  description:
    "Search the knowledge base for relevant information to help answer user questions",
  args: z.object({
    query: z.string().describe("The search query to find relevant information"),
  }),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      return "Missing thread id";
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: ctx.threadId,
      }
    );

    if (!conversation) {
      return "Conversation not found";
    }

    const orgId = conversation?.organizationId;

    const searchResults = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit: 5,
    });

    const contextText = `Found results in ${searchResults.entries
      ?.map((entry) => entry.title || null)
      .filter((entry) => entry !== null)
      ?.join(", ")}. Here is the context:\n\n${searchResults?.text}`;

    const response = await generateText({
      model: google.chat("gemini-2.5-flash"),
      messages: [
        {
          role: "system",
          content: SEARCH_INTERPRETER_PROMPT,
        },
        {
          role: "user",
          content: `User asked: "${args.query}"\n\nSearch results: ${contextText}`,
        },
      ],
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: response.text,
      },
    });
  },
});
