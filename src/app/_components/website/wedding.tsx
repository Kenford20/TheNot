import { headers } from "next/headers";
import { api } from "~/trpc/server";
import SomethingWentWrongPage from "../500";
import WeddingPage from "./wedding-page";

export default async function WeddingWebsite() {
  const headersList = headers();
  const websiteSubUrl = headersList.get("next-url");
  const path = headersList.get("referer");

  const weddingData = await api.website.fetchWeddingData.query({
    subUrl: websiteSubUrl?.replace("/", "") ?? null,
  });

  if (weddingData === null) return <SomethingWentWrongPage />;

  return <WeddingPage weddingData={weddingData} path={path ?? ""} />;
}
