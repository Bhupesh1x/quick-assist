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
  html: `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`,
  react: `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`,
  nextjs: `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`,
  javascript: `<script data-organization-id="{{ORGANIZATION_ID}}"></script>`,
};
