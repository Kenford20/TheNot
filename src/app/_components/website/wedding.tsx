import { useRouter } from "next/router";
import { api } from "~/trpc/server";
import SomethingWentWrongPage from "../500";
import WeddingPage from "./wedding-page";

export default async function WeddingWebsite() {
  const router = useRouter();
  const websiteUrl = router.query.subroute;

  const weddingData = await api.website.fetchWeddingData.query({
    subUrl: String(websiteUrl),
  });

  console.log("weddingz, ", weddingData);
  if (weddingData === null) return <SomethingWentWrongPage />;

  return <WeddingPage weddingData={weddingData} />;
}
