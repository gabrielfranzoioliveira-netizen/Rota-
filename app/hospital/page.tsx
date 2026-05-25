import { AuthGuard } from "@/components/auth-guard";
import { ExtraFeaturePage } from "@/features/extras/extra-feature-page";

export default function HospitalPage() {
  return (
    <AuthGuard allowedRoles={["hospital"]}>
      <ExtraFeaturePage kind="hospital" />
    </AuthGuard>
  );
}
