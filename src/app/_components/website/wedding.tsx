import { headers } from "next/headers";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import WeddingPage from "./wedding-page";

export default async function WeddingWebsite() {
  const headersList = headers();
  const websiteSubUrl = headersList.get("x-url");

  const weddingData = await api.website.fetchWeddingData
    .query({
      subUrl: websiteSubUrl?.replace("/", "") ?? "",
    })
    .catch((err) => console.log("website#fetchWeddingData error", err));

  if (weddingData === undefined) return notFound();

  return <WeddingPage weddingData={weddingData} path={websiteSubUrl ?? ""} />;
}
