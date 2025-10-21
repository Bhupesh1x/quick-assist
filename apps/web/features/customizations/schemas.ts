import { z } from "zod";

export const customizationsFormSchema = z.object({
  greetMessage: z.string().trim().min(1, "Greeting message is required"),
  manualPhoneNumber: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // skip validation if empty
      // Must start with '+'
      if (!val.startsWith("+")) return false;
      // Extract only digits
      const digits = val.replace(/\D/g, "");
      // Must have 8–15 digits total
      if (digits.length < 8 || digits.length > 15) return false;
      // Ensure only valid characters overall
      return /^\+[\d\s\-()]+$/.test(val);
    }, "Invalid phone number. Please verify it again and include country code (e.g. +91 9751234567) if missing"),
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
