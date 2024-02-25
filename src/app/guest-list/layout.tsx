import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";

import Navbar from "../_components/navbar";
import Footer from "../_components/footer";
import GuestHeader from "../_components/guest-list/header";

export const metadata = {
  title: "Your Wedding Website",
  description: "dashboard",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function GuestListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <Navbar />
      <GuestHeader />
      {children}
      <Footer />
    </TRPCReactProvider>
  );
}
