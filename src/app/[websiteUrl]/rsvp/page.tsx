import { api } from "~/trpc/server";
import { headers } from "next/headers";
import MainRsvpForm from "~/app/_components/website/forms/main";
import SomethingWentWrongPage from "~/app/_components/500";

export default async function RsvpPage() {
  const headersList = headers();
  const websiteSubUrl = headersList.get("next-url");

  // const weddingData = await api.website.fetchWeddingData.query({
  //   subUrl: websiteSubUrl?.replace("/", "").replace("/rsvp", "") ?? null,
  // });
  // console.log("weddingdataz", weddingData);

  // if (weddingData === null) return <SomethingWentWrongPage />;
  const weddingData = {
    groomFirstName: "foobar",
    brideFirstName: "lorem",
  };

  return <MainRsvpForm weddingData={weddingData} />;
}
