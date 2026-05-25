import { AuthGuard } from "@/components/auth-guard";
import { ExtraFeaturePage } from "@/features/extras/extra-feature-page";

export default function GuardianPage() {
  return (
    <AuthGuard allowedRoles={["guardian"]}>
      <ExtraFeaturePage kind="guardian" />
    </AuthGuard>
  );
}
