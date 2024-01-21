import { sharedStyles } from "../../utils/shared-styles";

import { type Dispatch, type SetStateAction } from "react";

type SidebarPanelProps = {
  setIsWebsiteSettingsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SidebarPanel({
  setIsWebsiteSettingsOpen,
}: SidebarPanelProps) {
  return (
    <section className="px-3">
      <div className="flex items-end justify-between border-b pb-8">
        <h2 className="text-xl font-semibold">Your Theme</h2>
        <span className={`text-${sharedStyles.primaryColor} text-lg`}>
          Browse Themes
        </span>
      </div>
      <div className="flex items-end justify-between border-b py-8">
        <h2 className="text-xl font-semibold">Privacy Settings</h2>
        <span
          className={`text-${sharedStyles.primaryColor} text-lg`}
          onClick={() => setIsWebsiteSettingsOpen(true)}
        >
          Manage
        </span>
      </div>
    </section>
  );
}
