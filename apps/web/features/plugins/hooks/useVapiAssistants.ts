import { toast } from "sonner";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@workspace/backend/_generated/api";

type VapiAssistants = typeof api.private.vapi.getAssistants._returnType;

export function useVapiAssistants(): {
  data: VapiAssistants;
  isLoading: boolean;
  error: Error | null;
} {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<VapiAssistants>([]);

  const getAssistants = useAction(api.private.vapi.getAssistants);

  useEffect(() => {
    async function fetchAssistants() {
      try {
        setIsLoading(true);

        const result = await getAssistants();

        setData(result);
        setError(null);
      } catch (error) {
        setError(error as Error);
        toast.error("Failed to fetch vapi assistants");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssistants();
  }, []);

  return { isLoading, error, data };
}
