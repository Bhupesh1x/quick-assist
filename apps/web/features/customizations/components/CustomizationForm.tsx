import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@workspace/ui/components/card";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Separator } from "@workspace/ui/components/separator";
import { Doc } from "@workspace/backend/_generated/dataModel";

import type { FormSchema } from "../types";
import { customizationsFormSchema } from "../schemas";

import { VapiFormFields } from "./VapiFormFields";

interface CustomizationData {
  organizationId: string;
  greetMessage: string;
  defaultSuggestions: {
    suggestion1?: string;
    suggestion2?: string;
    suggestion3?: string;
  };
  vapiSettings: {
    assistantId?: string;
    phoneNumber?: string;
  };
}

interface Props {
  hasVapiPlugin: boolean;
  initialData?: CustomizationData | null;
}

export function CustomizationForm({ initialData, hasVapiPlugin }: Props) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(customizationsFormSchema),
    defaultValues: {
      greetMessage:
        initialData?.greetMessage || "Hi, How can i help you today?",
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions?.suggestion1 || "",
        suggestion2: initialData?.defaultSuggestions?.suggestion2 || "",
        suggestion3: initialData?.defaultSuggestions?.suggestion3 || "",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings?.assistantId || "",
        phoneNumber: initialData?.vapiSettings?.phoneNumber || "",
      },
    },
  });

  const upsertData = useMutation(api.private.widgetSettings.upsert);

  async function onSubmit(values: FormSchema) {
    if (!form.formState.isSubmitting || !form.formState.isDirty) return;

    const vapiSettings: Doc<"widgetSettings">["vapiSettings"] = {
      assistantId:
        values.vapiSettings?.assistantId === "none"
          ? ""
          : values.vapiSettings?.assistantId,
      phoneNumber:
        values.vapiSettings?.phoneNumber === "none"
          ? ""
          : values.vapiSettings?.phoneNumber,
    };

    try {
      await upsertData({
        defaultSuggestions: values.defaultSuggestions,
        greetMessage: values.greetMessage,
        vapiSettings,
      });
      toast.success("Widget settings saved");
    } catch {
      toast.error("Failed to save widget settings. Please try again latter");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="px-6">
          <CardHeader className="p-0">
            <CardTitle>General chat settings</CardTitle>
            <CardDescription>
              Configure basic chat widget behavior and messages
            </CardDescription>
          </CardHeader>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greeting Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="The first message customers see when they open the chat"
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    The first message customers see when they open the chat
                  </FormDescription>
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Default Suggestions</h4>
                <p className="text-muted-foreground text-sm">
                  Quick reply suggestions shown to customers to help guide the
                  conversation
                </p>
              </div>
              <FormField
                control={form.control}
                name="defaultSuggestions.suggestion1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggestion 1</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Hi! How can i help you today?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultSuggestions.suggestion2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggestion 2</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. What are your pricing plans?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultSuggestions.suggestion3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggestion 3</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. I need help with my account"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Card>

        {hasVapiPlugin && (
          <Card className="px-6">
            <CardHeader className="p-0">
              <CardTitle>Vapi Assistants settings</CardTitle>
              <CardDescription>
                Configure voice calling features powered by vapi
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <VapiFormFields form={form} />
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end w-full">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting
              ? "Saving settings..."
              : "Save settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function CustomizationFormSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="px-6">
        <CardHeader className="p-0">
          <CardTitle>General chat settings</CardTitle>
          <CardDescription>
            Configure basic chat widget behavior and messages
          </CardDescription>
        </CardHeader>

        <div className="space-y-6">
          <Label>Greeting Message</Label>
          <Textarea
            disabled
            placeholder="The first message customers see when they open the chat"
          />

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Default Suggestions</h4>
              <p className="text-muted-foreground text-sm">
                Quick reply suggestions shown to customers to help guide the
                conversation
              </p>
            </div>
            <div className="space-y-2">
              <Label>Suggestion 1</Label>

              <Input
                disabled
                placeholder="e.g. Hi! How can i help you today?"
              />
            </div>
            <div className="space-y-2">
              <Label>Suggestion 2</Label>

              <Input
                disabled
                placeholder="e.g. Hi! How can i help you today?"
              />
            </div>
            <div className="space-y-2">
              <Label>Suggestion 3</Label>

              <Input disabled placeholder="e.g. I need help with my account" />
            </div>
          </div>
        </div>
      </Card>
      <div className="flex justify-end w-full">
        <Button disabled>Save settings</Button>
      </div>
    </div>
  );
}
