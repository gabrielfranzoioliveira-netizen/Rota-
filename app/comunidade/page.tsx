import { AuthGuard } from "@/components/auth-guard";
import { ExtraFeaturePage } from "@/features/extras/extra-feature-page";

export default function CommunityPage() {
  return (
    <AuthGuard>
      <ExtraFeaturePage kind="community" />
    </AuthGuard>
  );
}
