"use client";

import {
  BotIcon,
  GemIcon,
  MicIcon,
  PhoneIcon,
  UsersIcon,
  BookOpenIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Props {
  children: React.ReactNode;
}

const features: Feature[] = [
  {
    icon: BotIcon,
    title: "AI Customer Support",
    description: "Intelligent automated responses 24/7",
  },
  {
    icon: MicIcon,
    title: "AI Voice Agent",
    description: "Natural voice conversation with customers",
  },
  {
    icon: PhoneIcon,
    title: "Phone System",
    description: "Inbound & outbound calling capabilities",
  },
  {
    icon: BookOpenIcon,
    title: "Knowledge Base",
    description: "Train AI on your documentation",
  },
  {
    icon: UsersIcon,
    title: "Team Access",
    description: "Up to 5 operators per organization",
  },
];

export function PremiumFeatureOverlay({ children }: Props) {
  return (
    <main className="min-h-screen max-h-screen relative overflow-hidden">
      {/* Blurred background content */}
      <div className="pointer-events-none select-none blur-[2px]">
        {children}
      </div>

      {/* Overlay */}
      <div className="bg-black/50 absolute inset-0 backdrop-blur-[2px]" />

      {/* Features card */}

      <div className="absolute inset-0 flex items-center justify-center z-40 h-full w-full">
        <Card className="w-full max-w-md px-3 py-4 !gap-4">
          <div className="flex items-center justify-center">
            <div className="size-12 rounded-full flex items-center justify-center bg-muted border">
              <GemIcon className="size-6 text-muted-foreground" />
            </div>
          </div>

          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              Premium Features
            </CardTitle>
            <CardDescription>
              This features requires a Pro subscriptions
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {features?.map((feature) => (
              <div className="flex items-center gap-3" key={feature.title}>
                <div className="size-8 flex items-center justify-center bg-muted border rounded-lg">
                  <feature.icon className="size-4 text-muted-foreground" />
                </div>

                <div>
                  <h4 className="font-medium text-sm">{feature?.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {feature?.description}
                  </p>
                </div>
              </div>
            ))}

            <Button className="w-full" size="lg" asChild>
              <Link href="/billing">View Plans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
