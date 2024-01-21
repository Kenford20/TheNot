import { Suspense } from "react";
import { api } from "~/trpc/server";
import { cookies } from "next/headers";
import PasswordPage from "../_components/website/password-page";
import NotFoundPage from "../_components/404";
import WeddingWebsite from "../_components/website/wedding";
import Loading from "./loading";

type RootRouteHandlerProps = {
  params: {
    websiteUrl: string;
  };
};

export default async function RootRouteHandler({
  params: { websiteUrl },
}: RootRouteHandlerProps) {
  const website = await api.website.getByUrl.query({
    websiteUrl,
  });

  if (website === null) return <NotFoundPage />;
  if (!website.isPasswordEnabled) return <WeddingWebsite />;

  const hasPassword = cookies().get("wws_password")?.value === website.password;

  const setPasswordCookie = async (value: string) => {
    "use server";
    cookies().set("wws_password", value);
  };

  return (
    <Suspense fallback={<Loading />}>
      {hasPassword ? (
        <WeddingWebsite />
      ) : (
        <PasswordPage website={website} setPasswordCookie={setPasswordCookie} />
      )}
    </Suspense>
  );
}
