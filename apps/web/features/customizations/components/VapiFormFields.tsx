import { UseFormReturn } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormField,
  FormControl,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@workspace/ui/components/select";

import { useVapiAssistants } from "@/features/plugins/hooks/useVapiAssistants";
import { useVapiPhoneNumbers } from "@/features/plugins/hooks/useVapiPhoneNumbers";

import { FormSchema } from "../types";

interface Props {
  form: UseFormReturn<FormSchema>;
}

export function VapiFormFields({ form }: Props) {
  const { data: assistants, isLoading: isAssistantsLoading } =
    useVapiAssistants();
  const { data: phoneNumbers, isLoading: isPhoneNumbersLoading } =
    useVapiPhoneNumbers();

  const disabled = form.formState.isSubmitting;

  return (
    <>
      <FormField
        control={form.control}
        name="vapiSettings.assistantId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Assistant</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isAssistantsLoading || disabled}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isAssistantsLoading
                      ? "Loading assistants..."
                      : "Select an assistant"
                  }
                />
              </SelectTrigger>
              <FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {assistants?.map((assistant) => (
                    <SelectItem key={assistant.id} value={assistant.id}>
                      {assistant?.name || "Unnamed"} -{" "}
                      {assistant?.model?.model || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormControl>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vapiSettings.phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display phone number</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPhoneNumbersLoading || disabled}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isPhoneNumbersLoading
                      ? "Loading phone numbers..."
                      : "Select a phone number"
                  }
                />
              </SelectTrigger>
              <FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {phoneNumbers?.map((phone) => (
                    <SelectItem
                      key={phone.id}
                      value={phone?.number || phone.id}
                    >
                      {phone?.number || "Unknown"} - {phone?.name || "Unnamed"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormControl>
            </Select>
          </FormItem>
        )}
      />
    </>
  );
}
