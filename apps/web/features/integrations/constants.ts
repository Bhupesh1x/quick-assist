export const INTEGRATIONS = [
  {
    id: "html",
    label: "HTML",
    icon: "/languages/html5.svg",
  },
  {
    id: "react",
    label: "React",
    icon: "/languages/react.svg",
  },
  {
    id: "nextjs",
    label: "Next.js",
    icon: "/languages/nextjs.svg",
  },
  {
    id: "javascript",
    label: "Javascript",
    icon: "/languages/javascript.svg",
  },
] as const;

export type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

export const INTEGRATIONS_SCRIPT = {
  html: `<script src="https://quick-assist-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`,
  react: `<script src="https://quick-assist-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`,
  nextjs: `<script src="https://quick-assist-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`,
  javascript: `<script src="https://quick-assist-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`,
};
