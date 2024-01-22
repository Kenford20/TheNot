import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import GuestList from "../_components/guest-list";

export default async function DashboardPage() {
  const dashboardData = await api.dashboard.getByUserId.query();

  if (dashboardData === null) {
    redirect("/");
  }

  return (
    <main>
      <GuestList dashboardData={dashboardData} />
    </main>
  );
}
