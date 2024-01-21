import { api } from "~/trpc/server";
import PasswordPage from "../_components/website/password-page";
import NotFoundPage from "../_components/404";
import WeddingWebsite from "../_components/website/wedding";

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

  if (website === null) return <NotFoundPage />;
  if (!website.isPasswordEnabled) return <WeddingWebsite />;

  return (
    <PasswordPage website={website}>
      <WeddingWebsite />
    </PasswordPage>
  );
}
