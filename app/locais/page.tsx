import { AuthGuard } from "@/components/auth-guard";
import { ExtraFeaturePage } from "@/features/extras/extra-feature-page";

export default function PlacesPage() {
  return (
    <AuthGuard>
      <ExtraFeaturePage kind="places" />
    </AuthGuard>
  );
}
