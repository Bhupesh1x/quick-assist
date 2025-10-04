import {
  guessMimeTypeFromContents,
  contentHashFromArrayBuffer,
  guessMimeTypeFromExtension,
} from "@convex-dev/rag";
import { v, ConvexError } from "convex/values";

import { rag } from "../system/ai/rag";
import { action } from "../_generated/server";

import { extractTextContent } from "../lib/extractTextContent";

function guessMimeType(fileName: string, bytes: ArrayBuffer): string {
  return (
    guessMimeTypeFromExtension(fileName) ||
    guessMimeTypeFromContents(bytes) ||
    "application/octet-stream"
  );
}

export const create = action({
  args: {
    fileName: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
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

    const { fileName, bytes, category } = args;

    const mimeType = args.mimeType || guessMimeType(fileName, bytes);

    const blob = new Blob([bytes], { type: mimeType });

    const storageId = await ctx.storage.store(blob);

    const text = await extractTextContent(ctx, {
      fileName,
      storageId,
      bytes,
      mimeType,
    });

    const { entryId, created } = await rag.add(ctx, {
      // We add namespace to make sure the content is added to the current organization.
      // By default it will be considered global (we don't want this)
      namespace: orgId,
      text,
      key: fileName,
      title: fileName,
      metadata: {
        storageId,
        uploadedBy: orgId,
        fileName,
        category: category ?? null,
      },
      contentHash: await contentHashFromArrayBuffer(bytes), // To avoid re-inserting the file if the content hasn't changed
    });

    if (!created) {
      console.debug("Entry already exists, skipping upload metadata");
      await ctx.storage.delete(storageId);
    }

    return {
      url: ctx.storage.getUrl(storageId),
      entryId,
    };
  },
});
