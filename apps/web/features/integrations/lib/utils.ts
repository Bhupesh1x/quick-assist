import { IntegrationId, INTEGRATIONS_SCRIPT } from "../constants";

export function getIntegrationSnippet(
  integrationId: IntegrationId,
  organizationId: string
) {
  switch (integrationId) {
    case "html": {
      return INTEGRATIONS_SCRIPT.html?.replace(
        /{{ORGANIZATION_ID}}/g,
        organizationId
      );
    }
    case "react": {
      return INTEGRATIONS_SCRIPT.react?.replace(
        /{{ORGANIZATION_ID}}/g,
        organizationId
      );
    }
    case "nextjs": {
      return INTEGRATIONS_SCRIPT.nextjs?.replace(
        /{{ORGANIZATION_ID}}/g,
        organizationId
      );
    }
    case "javascript": {
      return INTEGRATIONS_SCRIPT.javascript?.replace(
        /{{ORGANIZATION_ID}}/g,
        organizationId
      );
    }
    default: {
      return "";
    }
  }
}
