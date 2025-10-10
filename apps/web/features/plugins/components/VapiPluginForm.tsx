import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
} from "@workspace/ui/components/form";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  publicApiKey: z.string().trim().min(1, "Public api key is required"),
  privateApiKey: z.string().trim().min(1, "Private api key is required"),
});

export function VapiPluginForm({ open, onOpenChange }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      privateApiKey: "",
      publicApiKey: "",
    },
  });

  const upsertPlugin = useMutation(api.private.plugins.upsert);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await upsertPlugin({
        service: "vapi",
        value: values,
      });

      onOpenChange(false);
      form?.reset();
      toast.success("Plugin added successfully");
    } catch {
      toast.error(
        "Failed to connect your plugin. Please try again after sometime"
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Vapi</DialogTitle>
          <DialogDescription>
            Your keys are safely encrypted and stored
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="publicApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public API Key</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your public API key"
                      disabled={false}
                      type="password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privateApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private API Key</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your private API key"
                      disabled={form.formState.isSubmitting}
                      type="password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                type="submit"
              >
                Connect
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
