import Link from "next/link";
import { sharedStyles } from "../../utils/shared-styles";
import Image from "next/image";
import PresentsImage from "../images/Birthday-Present-PNG-Pic.png";

type RegistrySetupProps = {
  setShowRegistrySetup: (x: boolean) => void;
};

export default function RegistrySetup({
  setShowRegistrySetup,
}: RegistrySetupProps) {
  return (
    <section className={`${sharedStyles.desktopPaddingSides} border-b py-10`}>
      <div className="flex">
        <Image
          alt="registry gifts"
          src={PresentsImage}
          width="130"
          height="130"
        />
        <div className="ml-10 flex flex-col">
          <h2 className="text-2xl font-semibold">
            Let&apos;s set up your registry
          </h2>
          <p className="my-5">
            Share your wish list with guests by linking an existing registry or
            starting a new one.
          </p>
          <div>
            <Link href="/registry">
              <button
                className={`${sharedStyles.secondaryButton({
                  px: "px-7",
                  py: "py-1",
                })}`}
              >
                Get Started
              </button>
            </Link>
            <button
              className="ml-5 underline hover:no-underline"
              onClick={() => {
                localStorage.setItem("registrySectionStatus", "hidden");
                setShowRegistrySetup(false);
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
