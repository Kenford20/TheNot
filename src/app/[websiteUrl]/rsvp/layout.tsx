import { RsvpFormProvider } from "~/app/_components/contexts/rsvp-form-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RsvpFormProvider>{children}</RsvpFormProvider>;
}
