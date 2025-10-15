"use client";

import {
  FileIcon,
  PlusIcon,
  Trash2Icon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useState } from "react";
import { usePaginatedQuery } from "convex/react";

import { DeleteFileDialog } from "../components/DeleteFileDialog";
import { UploadFileDialog } from "../components/UploadFileDialog";

import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@workspace/ui/components/table";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@workspace/ui/components/dropdown-menu";
import { Badge } from "@workspace/ui/components/badge";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { PublicFile } from "@workspace/backend/private/files";
import { useInfiniteScroll } from "@workspace/ui/hooks/useInfiniteScroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/InfiniteScrollTrigger";

interface Props {
  isOverlay?: boolean;
}

export function FilesView({ isOverlay = false }: Props) {
  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    { initialNumItems: 10 }
  );

  const {
    isLoadingFirstPage,
    canLoadMore,
    topElementRef,
    isLoadingMore,
    handleLoadMore,
  } = useInfiniteScroll({
    loadMore: files.loadMore,
    status: files.status,
    loadSize: 10,
  });

  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isFileDeleteDialogOpen, setIsFileDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);

  function onOpenFileUploadDialog() {
    if (isOverlay) return;

    setIsFileUploadDialogOpen(true);
  }

  function handleDeleteFileClick(file: PublicFile) {
    if (isOverlay) return;

    setSelectedFile(file);
    setIsFileDeleteDialogOpen(true);
  }

  function onFileDeleted() {
    if (isOverlay) return;

    setSelectedFile(null);
  }

  return (
    <>
      <UploadFileDialog
        open={isFileUploadDialogOpen}
        onOpenChange={setIsFileUploadDialogOpen}
      />
      <DeleteFileDialog
        open={isFileDeleteDialogOpen}
        onOpenChange={setIsFileDeleteDialogOpen}
        file={selectedFile}
        onFileDeleted={onFileDeleted}
      />
      <div className="min-h-screen bg-muted p-8 w-full">
        <div className="mx-auto w-full max-w-screen-lg">
          <header className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Knowledge Base</h1>
            <p className="text-sm text-muted-foreground font-[550]">
              Upload and manage documents for your AI assistant
            </p>
          </header>

          <main className="border rounded-xl bg-background flex flex-col mt-6">
            <div className="ml-auto py-4 px-6">
              <Button
                className="w-fit text-white"
                size="sm"
                onClick={onOpenFileUploadDialog}
              >
                <PlusIcon />
                Add New
              </Button>
            </div>

            <Table>
              <TableHeader className="border-y">
                <TableRow className="font-[580]">
                  <TableCell className="py-4 px-6">Name</TableCell>
                  <TableCell className="py-4 px-6">Type</TableCell>
                  <TableCell className="py-4 px-6">Size</TableCell>
                  <TableCell className="py-4 px-6">Actions</TableCell>
                </TableRow>

                {files?.isLoading && files?.results?.length === 0 ? (
                  <TableRow>
                    <TableCell className="h-24 text-center" colSpan={4}>
                      Loading files....
                    </TableCell>
                  </TableRow>
                ) : null}

                {!files?.isLoading && files?.results?.length === 0 ? (
                  <TableRow>
                    <TableCell className="h-24 text-center" colSpan={4}>
                      No files found
                    </TableCell>
                  </TableRow>
                ) : null}

                {!files?.isLoading && files?.results?.length > 0
                  ? files?.results?.map((file) => (
                      <TableRow key={file?.id} className="hover:bg-muted/50">
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <FileIcon />
                            {file?.name}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge className="uppercase" variant="outline">
                            {file?.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-muted-foreground">
                          {file?.size}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                className="size-8 p-0"
                                variant="ghost"
                              >
                                <MoreHorizontalIcon />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                className="group"
                                onClick={() => handleDeleteFileClick(file)}
                              >
                                <Trash2Icon className="size-4 mr-2 text-destructive group-hover:text-destructive/60" />
                                <span className="text-destructive group-hover:text-destructive/60">
                                  Delete
                                </span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableHeader>
            </Table>
            {!isLoadingFirstPage && files?.results?.length > 0 ? (
              <div>
                <InfiniteScrollTrigger
                  canLoadMore={canLoadMore}
                  isLoadingMore={isLoadingMore}
                  onLoadMore={handleLoadMore}
                  ref={topElementRef}
                />
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </>
  );
}
