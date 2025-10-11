import { z } from "zod";

export const customizationsFormSchema = z.object({
  greetMessage: z.string().trim().min(1, "Greeting message is required"),
  defaultSuggestions: z.object({
    suggestion1: z.optional(z.string()),
    suggestion2: z.optional(z.string()),
    suggestion3: z.optional(z.string()),
  }),
  vapiSettings: z.object({
    assistantId: z.optional(z.string()),
    phoneNumber: z.optional(z.string()),
  }),
});
