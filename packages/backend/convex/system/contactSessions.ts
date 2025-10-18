import { v, ConvexError } from "convex/values";

import {
  SESSION_DURATION_MS,
  AUTO_REFRESH_SESSION_THRESHOLD_MS,
} from "../constants";
import { internalMutation, internalQuery } from "../_generated/server";

export const getOne = internalQuery({
  args: {
    sessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

export const refresh = internalMutation({
  args: {
    sessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contextSession = await ctx.db.get(args.sessionId);

    if (!contextSession) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session not found",
      });
    }

    if (contextSession?.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Contact session expired",
      });
    }

    const timeRemaining = contextSession?.expiresAt - Date.now();

    if (timeRemaining < AUTO_REFRESH_SESSION_THRESHOLD_MS) {
      const newExpiresAt = Date.now() + SESSION_DURATION_MS;

      await ctx.db.patch(contextSession?._id, {
        expiresAt: newExpiresAt,
      });

      return { ...contextSession, expiresAt: newExpiresAt };
    }

    return contextSession;
  },
});
