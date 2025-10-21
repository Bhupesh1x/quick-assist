import { Protect } from "@clerk/nextjs";

import {
  CustomizationsView,
  CustomizationsViewSkeleton,
} from "@/features/customizations/views/CustomizationsView";
import { PremiumFeatureOverlay } from "@/features/billings/components/PremiumFeatureOverlay";

function CustomizationsPage() {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeatureOverlay>
          <CustomizationsViewSkeleton />
        </PremiumFeatureOverlay>
      }
    >
      <CustomizationsView />
    </Protect>
  );
}

export default CustomizationsPage;
