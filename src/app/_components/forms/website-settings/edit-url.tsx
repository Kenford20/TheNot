"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { sharedStyles } from "../../../utils/shared-styles";

import { type Dispatch, type SetStateAction } from "react";

type EditUrlViewProps = {
  setShowEditUrlView: Dispatch<SetStateAction<boolean>>;
  websiteUrl: string;
};

export default function EditUrlView({
  setShowEditUrlView,
  websiteUrl,
}: EditUrlViewProps) {
  const [urlInput, setUrlInput] = useState(websiteUrl ?? "");
  const router = useRouter();

  const updateWebsite = api.website.update.useMutation({
    onSuccess: () => {
      setShowEditUrlView(false);
      router.refresh();
    },
    onError: (err) => {
      if (err) window.alert(err);
      else window.alert("Failed to update website! Please try again later.");
    },
  });

  return (
    <div>
      <div className="flex justify-between border-b p-5">
        <div className="flex gap-4">
          <span
            className="cursor-pointer"
            onClick={() => setShowEditUrlView(false)}
          >
            <GoArrowLeft size={28} />
          </span>
          <span className="border-r"></span>
          <h1 className="text-2xl font-bold">Edit URL</h1>
        </div>
      </div>

      <div className="relative mt-7 px-5">
        <input
          type="text"
          id="floating_outlined"
          className="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <label
          htmlFor="floating_outlined"
          className="absolute left-7 start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          {window.location.host}
        </label>
      </div>

      <div
        className={`fixed bottom-0 flex flex-col gap-3 border-t px-8 py-5 ${sharedStyles.sidebarFormWidth}`}
      >
        <button
          disabled={updateWebsite.isLoading}
          className={`w-[100%] ${sharedStyles.primaryButton({
            py: "py-2",
            isLoading: updateWebsite.isLoading,
          })}`}
          onClick={() =>
            updateWebsite.mutate({
              basePath: window.location.host,
              subUrl: urlInput,
            })
          }
        >
          {updateWebsite.isLoading ? "Processing..." : "Save"}
        </button>
      </div>
    </div>
  );
}
