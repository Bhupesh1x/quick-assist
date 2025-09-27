"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  contactSessionIdFamily,
  organizationIdAtom,
} from "../atoms/WidgetAtom";
import { WidgetHeader } from "../components/WidgetHeader";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Doc } from "@workspace/backend/_generated/dataModel";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email(),
});

export function WidgetAuthScreen() {
  const createContactSession = useMutation(api.public.contactSessions.create);

  const organizationId = useAtomValue(organizationIdAtom);
  const setContactSessionId = useSetAtom(
    contactSessionIdFamily(organizationId || "")
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const metadata: Doc<"contactSessions">["metadata"] = {
      userAgent: navigator?.userAgent,
      cookieEnabled: navigator?.cookieEnabled,
      currentUrl: window?.location?.href,
      language: navigator?.language,
      languages: navigator?.languages?.join(","),
      platform: navigator?.platform,
      referrer: document?.referrer || "direct",
      timezoneOffset: new Date().getTimezoneOffset(),
      screenResolution: `${screen?.height}x${screen?.width}`,
      timezone: Intl.DateTimeFormat()?.resolvedOptions()?.timeZone,
      vendor: navigator?.vendor,
      viewportSize: `${window?.innerHeight}x${window?.innerWidth}`,
    };

    const contactSessionId = await createContactSession({
      ...values,
      organizationId: "123",
      metadata,
    });

    setContactSessionId(contactSessionId);
  }

  return (
    <>
      <WidgetHeader>
        <div className="space-y-2 px-2 py-4">
          <p className="text-3xl tracking-wide">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <section className="flex-1 px-6 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="h-10 bg-background"
                      placeholder="e.g. john doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="h-10 bg-background"
                      placeholder="e.g. john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              Continue
            </Button>
          </form>
        </Form>
      </section>
    </>
  );
}
