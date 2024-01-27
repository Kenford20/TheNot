import { api } from "~/trpc/server";
import { headers } from "next/headers";
import FindYourInvitationForm from "~/app/_components/website/rsvp/find-your-invitation";
import SomethingWentWrongPage from "~/app/_components/500";

export default async function RsvpForm() {
  const headersList = headers();
  const websiteSubUrl = headersList.get("next-url");

  const weddingData = await api.website.fetchWeddingData.query({
    subUrl: websiteSubUrl?.replace("/", "").replace("/rsvp", "") ?? null,
  });
  console.log("weddingdataz", weddingData);

  if (weddingData === null) return <SomethingWentWrongPage />;

  return <FindYourInvitationForm weddingData={weddingData} />;
}
