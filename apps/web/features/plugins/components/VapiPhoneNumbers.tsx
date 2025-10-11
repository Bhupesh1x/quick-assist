import { CheckCircleIcon, PhoneIcon, XCircleIcon } from "lucide-react";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";

import { useVapiPhoneNumbers } from "../hooks/useVapiPhoneNumbers";

export function VapiPhoneNumbers() {
  const { isLoading, data: phoneNumbers } = useVapiPhoneNumbers();

  return (
    <div className="border-b bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">Phone Numbers</TableHead>
            <TableHead className="px-6 py-4">Name</TableHead>
            <TableHead className="px-6 py-4">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3} className="px-4 py-8 text-center">
                Loading phone numbers...
              </TableCell>
            </TableRow>
          )}

          {!phoneNumbers?.length && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No phone numbers configured
              </TableCell>
            </TableRow>
          )}

          {phoneNumbers?.map((phone) => (
            <TableRow className="bg-muted/50" key={phone.id}>
              <TableCell className="px-2 md:px-6 py-4">
                <div className="flex items-center gap-3">
                  <PhoneIcon className="size-4 text-muted-foreground" />
                  <span className="font-mono text-xs">
                    {phone?.number || "Not configured"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-2 md:px-6 py-4">
                {phone?.name || "Unnamed"}
              </TableCell>
              <TableCell className="px-2 md:px-6 py-4">
                <Badge
                  className="capitalize"
                  variant={
                    phone?.status === "active" ? "default" : "destructive"
                  }
                >
                  {phone?.status === "active" ? (
                    <CheckCircleIcon className="mr-1 size-3" />
                  ) : (
                    <XCircleIcon className="mr-1 size-3" />
                  )}
                  {phone?.status || "Unknown"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
