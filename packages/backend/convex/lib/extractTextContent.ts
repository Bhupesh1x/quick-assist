import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { ConvexError } from "convex/values";

import type { StorageActionWriter } from "convex/server";

const AI_MODELS = {
  image: google.chat("gemini-2.5-flash"),
  pdf: google.chat("gemini-2.5-flash"),
  text: google.chat("gemini-2.5-flash"),
} as const;

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const SYSTEM_PROMPTS = {
  image:
    "You turn images into text. If it is a photo of a document, transcribe it. If it is not a photo of the document, describe it",
  pdf: "You transform PDF files into the text",
  html: "You transform content into the markdown",
} as const;

export interface ExtractTextContentArgs {
  fileName: string;
  storageId: string;
  bytes?: ArrayBuffer;
  mimeType: string;
}

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs
): Promise<string> {
  const { fileName, mimeType, storageId, bytes } = args;

  const fileUrl = await ctx.storage.getUrl(storageId);

  if (!fileUrl) {
    throw new Error("Failed to get storage url");
  }

  if (SUPPORTED_IMAGE_TYPES?.some((type) => type === mimeType)) {
    return extractImageText(fileUrl);
  }

  if (mimeType?.toLowerCase()?.includes("pdf")) {
    return extractPdfText(fileUrl, mimeType, fileName);
  }

  if (mimeType?.toLowerCase()?.includes("text")) {
    return extractTextFileContent(ctx, fileName, bytes, mimeType, storageId);
  }

  throw new ConvexError(`Unsupported mime type: ${mimeType}`);
}

async function extractImageText(fileUrl: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: new URL(fileUrl),
          },
        ],
      },
    ],
  });

  return result?.text || "";
}

async function extractPdfText(
  fileUrl: string,
  mimeType: string,
  fileName: string
): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: new URL(fileUrl),
            mimeType,
            filename: fileName,
          },
          {
            type: "text",
            text: "Extract the text from the PDF and print it without explaining you'll do so.",
          },
        ],
      },
    ],
  });

  return result?.text || "";
}

async function extractTextFileContent(
  ctx: { storage: StorageActionWriter },
  fileName: string,
  bytes: ArrayBuffer | undefined,
  mimeType: string,
  storageId: string
): Promise<string> {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());

  if (!arrayBuffer) {
    throw new Error(`Failed to get the file content for file ${fileName}`);
  }

  const text = new TextDecoder().decode(arrayBuffer);

  if (mimeType?.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.text,
      system: SYSTEM_PROMPTS.html,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text,
            },
            {
              type: "text",
              text: "Extract the text and print it in a markdown format without explaining that you'll do so.",
            },
          ],
        },
      ],
    });

    return result?.text;
  }

  return text;
}
