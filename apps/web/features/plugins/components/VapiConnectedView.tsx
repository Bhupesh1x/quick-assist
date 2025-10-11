import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { PhoneIcon, SettingsIcon, UnplugIcon } from "lucide-react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

import { VapiPhoneNumbers } from "./VapiPhoneNumbers";

interface Props {
  onDisconnect: () => void;
}

type VapiTabs = "phone-numbers" | "assistants";

export function VapiConnectedView({ onDisconnect }: Props) {
  const [activeTab, setActiveTab] = useState<VapiTabs>("phone-numbers");

  function onChangeTab(tab: string) {
    setActiveTab(tab as VapiTabs);
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between px-6 gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/vapi.jpg"
              alt="Vapi"
              height={48}
              width={48}
              className="rounded-lg"
            />

            <div className="text-left">
              <h4 className="text-lg font-[580]">Vapi Integration</h4>
              <p className="text-sm text-muted-foreground">
                Manage your phone numbers and AI assistants
              </p>
            </div>
          </div>

          <Button size="sm" variant="destructive" onClick={onDisconnect}>
            <UnplugIcon />
            Disconnect
          </Button>
        </div>
      </Card>

      <Card className="px-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-12 bg-muted border rounded-lg shrink-0">
              <SettingsIcon className="size-6 text-muted-foreground" />
            </div>

            <div className="text-left">
              <h4 className="text-lg font-[580]">Widget Configuration</h4>
              <p className="text-sm text-muted-foreground">
                Set up voice calls for your chat widget
              </p>
            </div>
          </div>

          <Button asChild>
            <Link href="/customizations">
              <SettingsIcon />
              Configure
            </Link>
          </Button>
        </div>
      </Card>

      <div className="bg-background border overflow-hidden rounded-lg">
        <Tabs
          defaultValue="phone-numbers"
          value={activeTab}
          onValueChange={onChangeTab}
        >
          <TabsList className="h-12 w-full grid grid-cols-2 p-0">
            <TabsTrigger value="phone-numbers">
              <PhoneIcon />
              Phone Numbers
            </TabsTrigger>
            <TabsTrigger value="assistants">
              <PhoneIcon />
              AI Assistants
            </TabsTrigger>
          </TabsList>
          <TabsContent value="phone-numbers">
            <VapiPhoneNumbers />
          </TabsContent>
          <TabsContent value="assistants">TODO: Assistants</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
