import { api } from "~/trpc/server";
import { headers } from "next/headers";
import MainRsvpForm from "~/app/_components/website/forms/main";
import SomethingWentWrongPage from "~/app/_components/500";
import { RsvpFormProvider } from "~/app/_components/contexts/rsvp-form-context";

export default async function RsvpPage() {
  const headersList = headers();
  const websiteSubUrl = headersList.get("next-url");

  const weddingData = await api.website.fetchWeddingData.query({
    subUrl: websiteSubUrl?.replace("/", "").replace("/rsvp", "") ?? null,
  });

  if (weddingData === null) return <SomethingWentWrongPage />;

  return (
    <RsvpFormProvider>
      <MainRsvpForm weddingData={weddingData} />
    </RsvpFormProvider>
  );
}
