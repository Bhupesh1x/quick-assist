import { v } from "convex/values";

import { decrypt, encrypt } from "../lib/crypto";
import { internalMutation, internalQuery } from "../_generated/server";

export const upsert = internalMutation({
  args: {
    organizationId: v.string(),
    secretName: v.string(),
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const existingIntegration = await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", args.organizationId).eq("service", args.service)
      )
      .unique();

    const value = JSON.stringify(args.value);
    const encryptedValue = encrypt(value);

    if (existingIntegration) {
      await ctx.db.patch(existingIntegration?._id, {
        service: args.service,
        value: encryptedValue,
      });
    } else {
      await ctx.db.insert("plugins", {
        organizationId: args.organizationId,
        secretName: args.secretName,
        service: args.service,
        value: args.value,
      });
    }
  },
});

export const getOneWithOrgIdAndService = internalQuery({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
  },
  handler: async (ctx, args) => {
    const plugin = await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", args.organizationId).eq("service", args.service)
      )
      .unique();

    if (!plugin) {
      return null;
    }

    const decryptedValue = decrypt(plugin.value);

    return {
      ...plugin,
      value: decryptedValue,
    };
  },
});
