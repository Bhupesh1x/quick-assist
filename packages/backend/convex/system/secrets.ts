import { v } from "convex/values";

import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

export const upsert = internalAction({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const secretName = `tenant/${args.organizationId}/${args.service}`;

    await ctx.runMutation(internal.system.plugins.upsert, {
      organizationId: args.organizationId,
      secretName: secretName,
      service: args.service,
      value: args.value,
    });

    return { status: "success" };
  },
});
