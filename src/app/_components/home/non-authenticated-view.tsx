import { SignInButton } from "@clerk/nextjs";

export default function NonAuthenticatedView() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="inline-block border-2 border-black p-2">
        <SignInButton />
      </div>
    </div>
  );
}
