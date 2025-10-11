import { z } from "zod";

import { customizationsFormSchema } from "./schemas";

export type FormSchema = z.infer<typeof customizationsFormSchema>;
