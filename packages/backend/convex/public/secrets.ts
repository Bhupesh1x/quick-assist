import { v } from "convex/values";

import { internal } from "../_generated/api";
import { action } from "../_generated/server";

export const getVapiSecrets = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const plugin = await ctx.runQuery(
      internal.system.plugins.getOneWithOrgIdAndService,
      {
        organizationId: args.organizationId,
        service: "vapi",
      }
    );

    if (!plugin) {
      return null;
    }

    const secretValue = plugin?.value as {
      publicApiKey: string;
      privateApiKey: string;
    };

    if (!secretValue) {
      return null;
    }

    if (!secretValue?.publicApiKey || !secretValue?.privateApiKey) {
      return null;
    }

    return {
      publicApiKey: secretValue?.publicApiKey,
    };
  },
});
