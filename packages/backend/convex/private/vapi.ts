import { ConvexError } from "convex/values";
import { VapiClient, Vapi } from "@vapi-ai/server-sdk";

import { internal } from "../_generated/api";
import { action } from "../_generated/server";

export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx): Promise<Vapi.PhoneNumbersListResponseItem[]> => {
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getOneWithOrgIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }

    const secretValue = plugin?.value;
    const secretData = secretValue?.privateApiKey;

    if (!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Secrets incomplete. Please reconnect your account",
      });
    }

    const vapi = new VapiClient({
      token: secretData,
    });

    const phoneNumbers = await vapi.phoneNumbers.list();

    return phoneNumbers;
  },
});

export const getAssistants = action({
  args: {},
  handler: async (ctx): Promise<Vapi.Assistant[]> => {
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

    const plugin = await ctx.runQuery(
      internal.system.plugins.getOneWithOrgIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    );

    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }

    const secretValue = plugin?.value;
    const secretData = secretValue?.privateApiKey;

    if (!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Secrets incomplete. Please reconnect your account",
      });
    }

    const vapi = new VapiClient({
      token: secretData,
    });

    const assistants = await vapi.assistants.list();

    return assistants;
  },
});
