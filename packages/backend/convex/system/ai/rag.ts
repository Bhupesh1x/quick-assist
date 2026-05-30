import { RAG } from "@convex-dev/rag";
import { google } from "@ai-sdk/google";

import { components } from "../../_generated/api";

export const rag = new RAG(components.rag, {
  textEmbeddingModel: google.textEmbeddingModel("gemini-embedding-001"),
  embeddingDimension: 3072,
});
