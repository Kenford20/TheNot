import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

import Dashboard from "../_components/dashboard";

export default async function DashboardPage() {
  const dashboardData = await api.dashboard.getByUserId.query();

  if (dashboardData === null) {
    redirect("/");
  }

  return (
    <main>
      <Dashboard dashboardData={dashboardData} />
    </main>
  );
}
