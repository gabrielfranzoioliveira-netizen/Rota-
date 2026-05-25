import { AppShell } from "@/components/app-shell";
import { AuthGuard } from "@/components/auth-guard";
import { PassengerDashboard } from "@/features/passenger/passenger-dashboard";

export default function PassengerPage() {
  return (
    <AuthGuard allowedRoles={["passenger"]}>
      <AppShell>
        <PassengerDashboard />
      </AppShell>
    </AuthGuard>
  );
}
