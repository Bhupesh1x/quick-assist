"use client";

import z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from "@workspace/ui/components/form";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@workspace/ui/components/dropzone";
import { Input } from "@workspace/ui/components/input";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";

interface Props {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onFileUpload?: () => void;
}

const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  fileName: z.string().optional(),
});

export function UploadFileDialog({ open, onOpenChange, onFileUpload }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      fileName: "",
    },
  });

  function onDrop(acceptedFiles: File[]) {
    const file = acceptedFiles?.[0];
    const filename = form.getValues("fileName");

    if (file) {
      setUploadedFiles([file]);

      if (!filename) {
        form.setValue("fileName", file?.name || "");
      }
    }
  }

  const addFile = useAction(api.private.files.create);

  function handleCancel() {
    setUploadedFiles([]);
    form.reset();
    onOpenChange(false);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const blob = uploadedFiles?.[0];

      if (!blob) {
        return;
      }

      const fileName = values.fileName || blob.name;

      await addFile({
        bytes: await blob?.arrayBuffer(),
        fileName,
        mimeType: blob.type || "text/plain",
        category: values?.category,
      });

      onFileUpload?.();
      handleCancel();
      toast.success("File uploaded");
    } catch {
      toast.error("Failed to upload file. Please try again after sometime");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload documents to your knowledge base for AI-powered search and
            retrieval
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-[550]">Category</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Documentation, Support, Product"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fileName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-[550]">
                      Filename{" "}
                      <span className="text-xs text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Override default name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Dropzone
                onDrop={onDrop}
                maxFiles={1}
                src={uploadedFiles}
                disabled={form.formState?.isSubmitting}
                accept={{
                  "application/pdf": [".pdf"],
                  "text/csv": [".csv"],
                  "text/plain": [".txt"],
                }}
              >
                <DropzoneEmptyState />
                <DropzoneContent />
              </Dropzone>

              <div className="flex justify-end gap-x-4">
                <Button
                  onClick={handleCancel}
                  disabled={form.formState?.isSubmitting}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    form.formState?.isSubmitting ||
                    !form.formState.isValid ||
                    !uploadedFiles?.length
                  }
                >
                  {form.formState?.isSubmitting ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
