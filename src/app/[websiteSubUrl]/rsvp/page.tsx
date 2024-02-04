import { api } from "~/trpc/server";
import { headers } from "next/headers";
import MainRsvpForm from "~/app/_components/website/forms/main";
import NotFoundPage from "~/app/_components/404";
import { RsvpFormProvider } from "~/app/_components/contexts/rsvp-form-context";

export default async function RsvpPage() {
  const headersList = headers();
  const websiteSubUrl = headersList.get("x-url");

  const weddingData = await api.website.fetchWeddingData
    .query({
      subUrl: websiteSubUrl?.replace("/", "").replace("/rsvp", "") ?? "",
    })
    .catch((err) => console.log("website#fetchWeddingData error", err));

  if (weddingData === undefined) return <NotFoundPage />;

  return (
    <RsvpFormProvider>
      <MainRsvpForm weddingData={weddingData} />
    </RsvpFormProvider>
  );
}
