import { api } from "~/trpc/server";
import { headers } from "next/headers";
import { RsvpFormProvider } from "~/app/_components/contexts/rsvp-form-context";
import MainRsvpForm from "~/app/_components/website/forms/main";
import NotFoundPage from "~/app/_components/404";

import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const path = headersList.get("x-url");
  const websiteSubUrl = path?.replace("/", "").replace("/rsvp", "") ?? "";
  const website = await api.website.getBySubUrl.query({
    subUrl: websiteSubUrl,
  });

  return {
    title: !!website
      ? `${website?.groomFirstName} ${website?.groomLastName} and ${website?.brideFirstName} ${website?.brideLastName}'s Wedding Website`
      : "Wedding Website",
  };
}

export default async function RsvpPage() {
  const headersList = headers();
  const path = headersList.get("x-url");
  const websiteSubUrl = path?.replace("/", "").replace("/rsvp", "") ?? "";

  const weddingData = await api.website.fetchWeddingData
    .query({ subUrl: websiteSubUrl })
    .catch((err) => console.log("website#fetchWeddingData error", err));

  if (weddingData === undefined || !weddingData.website.isRsvpEnabled)
    return <NotFoundPage />;

  return (
    <RsvpFormProvider>
      <MainRsvpForm
        weddingData={weddingData}
        basePath={`/${websiteSubUrl ?? ""}`}
      />
    </RsvpFormProvider>
  );
}
