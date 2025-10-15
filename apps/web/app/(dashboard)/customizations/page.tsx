import { Protect } from "@clerk/nextjs";

import { CustomizationsView } from "@/features/customizations/views/CustomizationsView";
import { PremiumFeatureOverlay } from "@/features/billings/components/PremiumFeatureOverlay";

function CustomizationsPage() {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <CustomizationsView isOverlay={true} />
        </PremiumFeatureOverlay>
      }
    >
      <CustomizationsView />
    </Protect>
  );
}

export default CustomizationsPage;
