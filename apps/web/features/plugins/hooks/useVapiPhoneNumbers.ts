import { toast } from "sonner";
import { useAction } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@workspace/backend/_generated/api";

type VapiPhoneNumbers = typeof api.private.vapi.getPhoneNumbers._returnType;

export function useVapiPhoneNumbers(): {
  data: VapiPhoneNumbers;
  isLoading: boolean;
  error: Error | null;
} {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<VapiPhoneNumbers>([]);

  const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumbers);

  useEffect(() => {
    async function fetchPhoneNumbers() {
      try {
        setIsLoading(true);

        const result = await getPhoneNumbers();

        setData(result);
        setError(null);
      } catch (error) {
        setError(error as Error);
        toast.error("Failed to fetch vapi phone numbers");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhoneNumbers();
  }, []);

  return { isLoading, error, data };
}
