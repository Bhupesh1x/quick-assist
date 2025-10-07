import Image from "next/image";
import { ArrowRightLeftIcon, PlugIcon, type LucideIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

export interface IntegrationFeature {
  icon: LucideIcon;
  name: string;
  description: string;
}

interface Props {
  disabled?: boolean;
  serviceName: string;
  serviceImageUrl: string;
  features: IntegrationFeature[];
  onSubmit: () => void;
}

export function PluginCard({
  features,
  serviceName,
  serviceImageUrl,
  disabled = false,
  onSubmit,
}: Props) {
  return (
    <div className="flex flex-col w-full bg-background border rounded-lg p-8">
      <div className="space-y-4 text-center w-full">
        <div className="flex items-center justify-center w-full gap-x-6">
          <Image
            src={serviceImageUrl}
            alt={serviceName}
            height={40}
            width={40}
            className="rounded object-contain"
          />
          <ArrowRightLeftIcon className="text-muted-foreground" />
          <Image
            src="/logo.svg"
            alt="logo"
            height={40}
            width={40}
            className="rounded object-contain"
          />
        </div>
        <h4 className="text-lg">Connect your {serviceName} account</h4>
      </div>

      <div className="space-y-4 my-6">
        {features?.map((feature) => (
          <div className="flex items-center gap-x-3" key={feature.name}>
            <div className="size-9 bg-muted rounded-lg border flex items-center justify-center">
              <feature.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">{feature?.name}</h4>
              <p className="text-xs text-muted-foreground">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button disabled={disabled} onClick={onSubmit}>
        Connect
        <PlugIcon />
      </Button>
    </div>
  );
}
