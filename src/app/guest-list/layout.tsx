import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";

import Navbar from "../_components/navbar";
import Footer from "../_components/footer";

export const metadata = {
  title: "Your Wedding Website",
  description: "dashboard",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <Navbar />
      {children}
      <Footer />
    </TRPCReactProvider>
  );
}
