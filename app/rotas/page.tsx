import { AuthGuard } from "@/components/auth-guard";
import { ExtraFeaturePage } from "@/features/extras/extra-feature-page";

export default function RoutesPage() {
  return (
    <AuthGuard>
      <ExtraFeaturePage kind="routes" />
    </AuthGuard>
  );
}
