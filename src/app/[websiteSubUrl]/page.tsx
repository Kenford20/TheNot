import { api } from "~/trpc/server";
import { cookies } from "next/headers";
import PasswordPage from "../_components/website/password-page";
import NotFoundPage from "../_components/404";
import WeddingWebsite from "../_components/website/wedding";

import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const user = await api.user.get.query();
  return {
    title: `${user?.groomFirstName} ${user?.groomLastName} and ${user?.brideFirstName} ${user?.brideLastName}`,
  };
}

type RootRouteHandlerProps = {
  params: {
    websiteSubUrl: string;
  };
};

export default async function RootRouteHandler({
  params: { websiteSubUrl },
}: RootRouteHandlerProps) {
  const website = await api.website.getBySubUrl.query({
    subUrl: websiteSubUrl,
  });

  if (website === null) return <NotFoundPage />;
  if (!website.isPasswordEnabled) return <WeddingWebsite />;

  const hasPassword = cookies().get("wws_password")?.value === website.password;

  const setPasswordCookie = async (value: string) => {
    "use server";
    cookies().set("wws_password", value);
  };

  return (
    <main>
      {hasPassword ? (
        <WeddingWebsite />
      ) : (
        <PasswordPage website={website} setPasswordCookie={setPasswordCookie} />
      )}
    </main>
  );
}
