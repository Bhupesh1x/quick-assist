import { v, ConvexError } from "convex/values";

import { internal } from "../_generated/api";
import { mutation, query } from "../_generated/server";

export const getOne = query({
  args: {
    service: v.union(v.literal("vapi")),
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

    const plugin =
      (await ctx.db
        .query("plugins")
        .withIndex("by_organization_id_and_service", (q) =>
          q.eq("organizationId", orgId).eq("service", args.service)
        )
        .unique()) ?? null;

    return plugin ? { ...plugin, value: undefined } : null;
  },
});

export const remove = mutation({
  args: {
    service: v.union(v.literal("vapi")),
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

    const existingPlugin = await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", orgId).eq("service", args.service)
      )
      .unique();

    if (!existingPlugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }

    await ctx.db.delete(existingPlugin?._id);
  },
});

export const upsert = mutation({
  args: {
    service: v.union(v.literal("vapi")),
    value: v.any(),
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

    await ctx.scheduler.runAfter(0, internal.system.secrets.upsert, {
      organizationId: orgId,
      service: args.service,
      value: args.value,
    });
  },
});
