"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { CopyIcon } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";

import { getIntegrationSnippet } from "../lib/utils";
import { IntegrationId, INTEGRATIONS } from "../constants";

import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";

import { IntegrationsDialog } from "../components/IntegrationsDialog";

export function IntegrationsView() {
  const { organization } = useOrganization();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState("");

  function openDialog(integrationId: IntegrationId) {
    if (!organization?.id) {
      toast.error("Missing organization id");
      return;
    }

    const snippet = getIntegrationSnippet(integrationId, organization?.id);

    setSelectedSnippet(snippet);
    setDialogOpen(true);
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(organization?.id ?? "");
      toast.success("Organization ID copied");
    } catch {
      toast.error(
        "Failed to copy organization id. Please try again after sometime"
      );
    }
  }

  return (
    <>
      <IntegrationsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        snippet={selectedSnippet}
      />
      <div className="min-h-screen bg-muted p-8 w-full">
        <div className="max-w-screen-md mx-auto">
          <header className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Setup & Integrations</h1>
            <p className="text-muted-foreground">
              Choose the integration that&apos;s right for you
            </p>
          </header>

          <main className="mt-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="organization-id"
                  className="md:w-34 lg:text-lg text-sm"
                >
                  <span className="hidden md:block">Organization ID</span>
                  <span className="block md:hidden">Org ID</span>
                </Label>
                <Input
                  className="flex-1 bg-background font-mono text-sm"
                  value={organization?.id ?? ""}
                  readOnly
                  disabled
                />
                <Button size="sm" onClick={onCopy}>
                  <CopyIcon />
                  Copy
                </Button>
              </div>

              <Separator />

              <div className="space-y-1">
                <h4 className="text-lg">Integrations</h4>
                <p className="text-muted-foreground text-sm">
                  Add the following code to your website to enable the checkbox.
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {INTEGRATIONS?.map((integration) => (
                  <button
                    type="button"
                    className="flex items-center gap-4 p-4 border bg-background rounded-lg flex-1 cursor-pointer"
                    key={integration.id}
                    onClick={() => openDialog(integration.id)}
                  >
                    <Image
                      src={integration?.icon}
                      height={32}
                      width={32}
                      alt={integration?.label}
                    />
                    <p className="text-lg">{integration?.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
