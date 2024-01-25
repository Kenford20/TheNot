import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import { sharedStyles } from "../utils/shared-styles";

import Dashboard from "../_components/dashboard";

export default async function DashboardPage() {
  const dashboardData = await api.dashboard.getByUserId.query();

  if (dashboardData === null) {
    redirect("/");
  }

  return (
    <main
      className={`${sharedStyles.desktopPaddingSides} ${sharedStyles.minPageWidth}`}
    >
      <Dashboard dashboardData={dashboardData} />
    </main>
  );
}
