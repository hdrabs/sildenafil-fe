import { AuthGuard } from "@/components/AuthGuard";
import { MainNav } from "@/components/Navbar/MainNav";
import { PatientShell } from "@/components/Navbar/PatientShell";

const PatientLayout = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard requireAuth>
    <div className="flex min-h-screen flex-col bg-bg-main">
      <MainNav />
      <PatientShell>{children}</PatientShell>
    </div>
  </AuthGuard>
);

export default PatientLayout;
