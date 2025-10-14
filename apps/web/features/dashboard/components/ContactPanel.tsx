"use client";

import Bowser from "bowser";

import {
  Cpu,
  Link2,
  MailIcon,
  GlobeIcon,
  Loader2Icon,
  MonitorIcon,
  AlertTriangleIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "convex/react";

import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Id } from "@workspace/backend/_generated/dataModel";
import { DicebarAvatar } from "@workspace/ui/components/ai/dicebar-avatar";

interface Props {
  children: React.ReactNode;
  conversationId: Id<"conversations">;
}

interface InfoItem {
  label: string;
  value: string | React.ReactNode;
  className?: string;
  showTitle?: boolean;
}

interface InfoSection {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: InfoItem[];
}

export function ContactPanel({ children, conversationId }: Props) {
  const contactSession = useQuery(
    api.private.contactSessions.getByConversationId,
    conversationId
      ? {
          conversationId,
        }
      : "skip"
  );

  const countryInfo = useMemo(() => {
    if (!contactSession?.metadata?.timezone) {
      return null;
    }

    return getCountryFromTimezone(contactSession?.metadata?.timezone) ?? null;
  }, [contactSession?.metadata?.timezone]);

  const countryFlagUrl = useMemo(() => {
    if (!countryInfo?.code) {
      return null;
    }

    return getCountryFlagUrl(countryInfo?.code);
  }, [contactSession?._id]);

  const userAgentInfo = useMemo(() => {
    const userAgent = contactSession?.metadata?.userAgent;

    if (!userAgent) {
      return { browser: "Unknown", os: "Unknown", device: "Unknown" };
    }

    const browser = Bowser.getParser(userAgent);
    const result = browser?.getResult();

    return {
      browser: result?.browser?.name || "Unknown",
      browserVersion: result?.browser?.version || "",
      os: result?.os?.name || "Unknown",
      osVersion: result?.os?.version || "",
      device: result?.platform?.type || "desktop",
      deviceModel: result?.platform?.model || "",
      deviceVendor: result?.platform?.vendor || "",
    };
  }, [contactSession?._id]);

  const accordionSections = useMemo<InfoSection[]>(() => {
    if (!contactSession?.metadata) {
      return [];
    }

    const md = contactSession.metadata;

    return [
      {
        id: "device-info",
        icon: MonitorIcon,
        title: "Device Information",
        items: [
          {
            label: "Browser",
            value:
              userAgentInfo?.browser +
              (userAgentInfo?.browserVersion
                ? ` ${userAgentInfo?.browserVersion}`
                : ""),
          },
          {
            label: "OS",
            value:
              userAgentInfo?.os +
              (userAgentInfo?.osVersion ? ` ${userAgentInfo?.osVersion}` : ""),
          },
          {
            label: "Device",
            value:
              userAgentInfo?.device +
              (userAgentInfo?.deviceModel
                ? ` ${userAgentInfo?.deviceModel}`
                : ""),
            className: "capitalize",
          },
          {
            label: "Screen",
            value: md.screenResolution,
          },
          {
            label: "Viewport",
            value: md.viewportSize,
          },
          {
            label: "Cookies",
            value: md.cookieEnabled ? "Enabled" : "Disabled",
          },
        ],
      },
      {
        id: "platform-info",
        icon: Cpu,
        title: "Platform & Vendor",
        items: [
          {
            label: "Platform",
            value: md.platform || "",
          },
          {
            label: "Vendor",
            value: md.vendor || "",
          },
        ],
      },
      {
        id: "location-info",
        icon: GlobeIcon,
        title: "Location & Language",
        items: countryInfo
          ? [
              {
                label: "Country",
                value: countryInfo?.name || "",
              },
              {
                label: "Language",
                value: md.language || "",
              },
              {
                label: "Timezone",
                value: md.timezone || "",
              },
              {
                label: "UTC Offset",
                value: md.timezoneOffset,
              },
            ]
          : [],
      },
      {
        id: "referrer-info",
        icon: Link2,
        title: "Referrer & URL",
        items: [
          {
            label: "Referrer",
            value: md.referrer || "N/A",
          },
          {
            label: "Current URL",
            value: md.currentUrl || "N/A",
            showTitle: true,
          },
        ],
      },
    ];
  }, [contactSession?._id]);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader className="hidden">
          <SheetTitle className="hidden">Contact Panel</SheetTitle>
        </SheetHeader>

        {contactSession === undefined ? (
          <ContactPanelLoading />
        ) : !contactSession ? (
          <ContactPanelError />
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 w-full space-y-4">
              <div className="flex gap-2">
                <DicebarAvatar
                  seed={contactSession?._id || "user"}
                  badgeImageUrl={countryFlagUrl ? countryFlagUrl : undefined}
                  size={38}
                  className="shrink-0"
                />

                <div className="w-full flex-1 overflow-hidden">
                  <h4 className="font-[550] line-clamp-1">
                    {contactSession?.name}
                  </h4>
                  <p className="text-sm line-clamp-1 text-muted-foreground">
                    {contactSession?.email}
                  </p>
                </div>
              </div>

              <Button size="lg" className="text-sm w-full" asChild>
                <Link href={`mailto:${contactSession?.email}`}>
                  <MailIcon />
                  Send Email
                </Link>
              </Button>
            </div>

            {!!accordionSections?.length && (
              <Accordion type="single" collapsible className="border-b">
                {accordionSections?.map((section) => (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className="rounded-none outline-none has-focus-visible:z-10 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                  >
                    <AccordionTrigger className="flex w-full flex-1 items-start justify-between gap-4 rounded-none bg-accent px-5 py-4 text-left font-medium text-sm outline-none transition-all hover:no-underline disabled:pointer-events-none disabled:opacity-50">
                      <div className="flex items-center gap-4">
                        <section.icon className="size-4 shrink-0" />
                        <p>{section.title}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 py-4">
                      {section?.items?.map((item) => (
                        <div
                          key={`${item.label}-${section.id}`}
                          className="flex justify-between gap-4 text-sm space-y-2"
                        >
                          <p className="text-muted-foreground">
                            {item?.label}:
                          </p>
                          <p
                            title={
                              item?.showTitle && typeof item?.value === "string"
                                ? item?.value
                                : undefined
                            }
                            className={`line-clamp-1 w-full truncate max-w-[60%] text-right ${item?.className ?? ""}`}
                          >
                            {item?.value}
                          </p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ContactPanelError() {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-y-2 text-muted-foreground h-full text-center">
      <AlertTriangleIcon />
      <p>Failed to load contact panel. Please try again after sometime</p>
    </div>
  );
}

function ContactPanelLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-y-2 text-muted-foreground h-full text-center">
      <Loader2Icon className="animate-spin" />
      <p>Loading...</p>
    </div>
  );
}
