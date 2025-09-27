import { v } from "convex/values";
import { createClerkClient } from "@clerk/backend";

import { action } from "../_generated/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET,
});

export const validate = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (_, args) => {
    if (!args.organizationId) {
      return { valid: false, reason: "Organization id is required" };
    }

    try {
      await clerkClient.organizations.getOrganization({
        organizationId: args.organizationId,
      });

      return { valid: true };
    } catch {
      return { valid: false, reason: "Organization not valid" };
    }
  },
});
