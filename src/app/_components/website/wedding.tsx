import { headers } from "next/headers";
import { api } from "~/trpc/server";
import WeddingPage from "./wedding-page";
import NotFoundPage from "../404";

export default async function WeddingWebsite() {
  const headersList = headers();
  const websiteSubUrl = headersList.get("x-url");

  const weddingData = await api.website.fetchWeddingData
    .query({
      subUrl: websiteSubUrl?.replace("/", "") ?? "",
    })
    .catch((err) => console.log("website#fetchWeddingData error", err));

  if (weddingData === undefined) return <NotFoundPage />;

  return <WeddingPage weddingData={weddingData} path={websiteSubUrl ?? ""} />;
}
