import { BotIcon } from "lucide-react";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@workspace/ui/components/table";

import { useVapiAssistants } from "../hooks/useVapiAssistants";

export function VapiAssistants() {
  const { isLoading, data: assistants } = useVapiAssistants();

  return (
    <div className="border-b bg-background max-w-[400px] md:max-w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">Assistant</TableHead>
            <TableHead className="px-6 py-4">Model</TableHead>
            <TableHead className="px-6 py-4">First Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3} className="px-4 py-8 text-center">
                Loading assistants...
              </TableCell>
            </TableRow>
          )}

          {!isLoading && !assistants?.length && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No assistant configured
              </TableCell>
            </TableRow>
          )}

          {assistants?.map((assistant) => (
            <TableRow className="bg-muted/50" key={assistant?.id}>
              <TableCell className="px-2 md:px-6 py-4">
                <div className="flex items-center gap-3">
                  <BotIcon className="size-4 text-muted-foreground" />
                  <span className="text-xs md:text-base">
                    {assistant?.name || "Unnamed"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-2 md:px-6 py-4">
                {assistant?.model?.model || "Not configured"}
              </TableCell>
              <TableCell className="px-2 md:px-6 py-4">
                <p className="text-xs md:text-sm text-muted-foreground">
                  {assistant?.firstMessage || "No greetings configured"}
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
