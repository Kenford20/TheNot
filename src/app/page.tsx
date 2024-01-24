import { unstable_noStore as noStore } from "next/cache";
import { SignedIn, SignedOut } from "@clerk/nextjs";

import { type Metadata } from "next";
import NonAuthenticatedView from "./_components/home/non-authenticated-view";
import AuthenticatedView from "./_components/home/authenticated-view";

export const metadata: Metadata = {
  title: "My Page Title",
};

export default async function Home() {
  noStore();

  return (
    <>
      <SignedOut>
        <NonAuthenticatedView />
      </SignedOut>
      <SignedIn>
        <AuthenticatedView />
      </SignedIn>
    </>
  );
}
