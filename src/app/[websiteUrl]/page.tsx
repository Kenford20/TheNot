import { api } from "~/trpc/server";
import PasswordPage from "../_components/website/password-page";
import NotFoundPage from "../_components/404";

type RootRouteHandlerProps = {
  params: {
    websiteUrl: string;
  };
};

export default async function RootRouteHandler({
  params: { websiteUrl },
}: RootRouteHandlerProps) {
  console.log("url ", websiteUrl);

  const website = await api.website.getByUrl.query({
    websiteUrl,
  });

  console.log("web", website);
  if (website === null) return <NotFoundPage />;

  return <PasswordPage website={website} />;
}
