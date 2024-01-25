import { sharedStyles } from "../../utils/shared-styles";
import { FiEdit2 } from "react-icons/fi";
import { FaRegCopy } from "react-icons/fa";

import { type Dispatch, type SetStateAction } from "react";

type DashboardHeaderProps = {
  websiteUrl: string | undefined;
  setIsWebsiteSettingsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DashboardHeader({
  websiteUrl,
  setIsWebsiteSettingsOpen,
}: DashboardHeaderProps) {
  return (
    <section className="py-10">
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-3xl font-bold">Your Website</h1>
          <div className="mt-2 flex">
            <p>{websiteUrl}</p>
            <span
              className={`ml-5 cursor-pointer text-${sharedStyles.primaryColor} flex items-center gap-1`}
            >
              <FaRegCopy size={16} color={sharedStyles.primaryColorHex} />
              Copy
            </span>
            <span
              className={`ml-5 cursor-pointer text-${sharedStyles.primaryColor} flex items-center gap-1`}
              onClick={() => setIsWebsiteSettingsOpen(true)}
            >
              <FiEdit2 size={16} color={sharedStyles.primaryColorHex} />
              Edit
            </span>
          </div>
        </div>
        <div>
          <button className={sharedStyles.secondaryButton()}>
            Share your Website
          </button>
          <button className={`ml-5 ${sharedStyles.primaryButton()}`}>
            Preview Site
          </button>
        </div>
      </div>
    </section>
  );
}
