import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";

import Navbar from "../_components/navbar";
import Footer from "../_components/footer";
import { EditRsvpSettingsFormProvider } from "../_components/contexts/edit-rsvp-settings-form-context";

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
      <EditRsvpSettingsFormProvider>
        <Navbar />
        {children}
        <Footer />
      </EditRsvpSettingsFormProvider>
    </TRPCReactProvider>
  );
}
