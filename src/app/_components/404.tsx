import { sharedStyles } from "../utils/shared-styles";
import Footer from "./footer";
import Navbar from "./navbar";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-96 items-center justify-center">
        <div className="flex flex-col gap-5 text-center">
          <h1 className="text-3xl">We can&apos;t find this page.</h1>
          <p>Sorry about that. Let&apos;s find a better place for you to go.</p>
          <div>
            <button className={`w-48 p-5 ${sharedStyles.primaryButton()}`}>
              Go to home page
            </button>
          </div>
          <p>
            Need help?{" "}
            <a href="#" className="underline">
              Search our Help Center or contact us.
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
