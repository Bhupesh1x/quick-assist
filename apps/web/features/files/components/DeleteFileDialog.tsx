"use client";

import { useState } from "react";
import { useMutation } from "convex/react";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import type { PublicFile } from "@workspace/backend/private/files";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: PublicFile | null;
  onFileDeleted?: () => void;
}

export function DeleteFileDialog({
  open,
  file,
  onOpenChange,
  onFileDeleted,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteFile = useMutation(api.private.files.deleteFile);

  function handleCancel() {
    onOpenChange(false);
  }

  async function handleDelete() {
    if (!file) return;

    try {
      setIsDeleting(true);

      await deleteFile({
        entryId: file.id,
      });

      onFileDeleted?.();
      handleCancel();
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete file</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this file? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!!file && (
            <div className="bg-muted border rounded p-4 space-y-1">
              <h4 className="font-semibold">{file?.name}</h4>
              <p className="text-sm text-muted-foreground">
                Type: {file?.type?.toUpperCase()} | Size: {file?.size}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !file}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
