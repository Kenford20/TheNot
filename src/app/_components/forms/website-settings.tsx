"use client";

import { useState } from "react";
import { api } from "~/trpc/server";
import { IoMdClose } from "react-icons/io";
import { BsTrash3 } from "react-icons/bs";
import { GoArrowLeft } from "react-icons/go";
import { LoadingSpinner } from "../loaders";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

import { useDisablePageScroll } from "../hooks";
import { sharedStyles } from "../../utils/shared-styles";

import { type Dispatch, type SetStateAction } from "react";
import { type Website } from "../../utils/shared-types";

type TUpdateWebsiteParams = {
  isPasswordEnabled?: boolean;
  password?: string;
  url?: string;
};

type WebsiteSettingsFormProps = {
  setIsWebsiteSettingsOpen: Dispatch<SetStateAction<boolean>>;
  website: Website | null;
};

export default function WebsiteSettingsForm({
  setIsWebsiteSettingsOpen,
  website,
}: WebsiteSettingsFormProps) {
  const [showPasswordPage, setShowPasswordPage] = useState<boolean>(false);
  const [showUrlPage, setShowUrlPage] = useState<boolean>(false);
  const [updatedWebsite, setUpdatedWebsite] = useState<Website | null>(website);

  const { mutate, isLoading: isUpdatingWebsite } =
    api.website.update.useMutation({
      onSuccess: (updated) => {
        console.log("updates", updated);
        setUpdatedWebsite(updated);
        setShowPasswordPage(false);
      },
      onError: (err) => {
        if (err) window.alert(err);
        else window.alert("Failed to update website! Please try again later.");
      },
    });

  const updateWebsite = (args: TUpdateWebsiteParams) => {
    mutate({ ...args });
  };

  useDisablePageScroll();

  return (
    <div className="fixed top-0 z-50 flex h-screen w-screen justify-end bg-transparent/[0.5] pb-24">
      <div
        className={`relative h-screen ${sharedStyles.sidebarFormWidth} bg-white`}
      >
        {showPasswordPage ? (
          <SetPasswordPage
            setShowPasswordPage={setShowPasswordPage}
            password={updatedWebsite?.password ?? ""}
            updateWebsite={updateWebsite}
            isUpdatingWebsite={isUpdatingWebsite}
          />
        ) : showUrlPage ? (
          <EditUrlPage />
        ) : (
          <Main
            setIsWebsiteSettingsOpen={setIsWebsiteSettingsOpen}
            website={updatedWebsite}
            updateWebsite={updateWebsite}
            isUpdatingWebsite={isUpdatingWebsite}
            setShowPasswordPage={setShowPasswordPage}
          />
        )}
      </div>
    </div>
  );
}

type MainProps = {
  setIsWebsiteSettingsOpen: Dispatch<SetStateAction<boolean>>;
  website: Website | null;
  updateWebsite: (args: TUpdateWebsiteParams) => void;
  isUpdatingWebsite: boolean;
  setShowPasswordPage: Dispatch<SetStateAction<boolean>>;
};

const Main = ({
  setIsWebsiteSettingsOpen,
  website,
  updateWebsite,
  isUpdatingWebsite,
  setShowPasswordPage,
}: MainProps) => {
  const [appearInSearchEngines, setAppearInSearchEngines] =
    useState<boolean>(false);

  const handleChange = (checked: boolean) => {
    console.log("targz", checked);
    if (!website?.isPasswordEnabled) {
      setShowPasswordPage(true);
    } else {
      updateWebsite({
        isPasswordEnabled: checked,
        password: "",
      });
    }
  };

  return (
    <>
      <div className="flex justify-between border-b px-8 py-5">
        <h1 className="text-2xl font-bold">Settings</h1>
        <span
          className="cursor-pointer"
          onClick={() => setIsWebsiteSettingsOpen(false)}
        >
          <IoMdClose size={25} />
        </span>
      </div>
      <div className="px-8 pb-5">
        <h2 className="my-4 text-2xl font-bold">Visibility</h2>
        <div className="flex items-center justify-between pb-3">
          <Label htmlFor="search-engine-toggle" className="text-md">
            Appear in Search Engines
          </Label>
          <Switch
            id="search-engine-toggle"
            checked={appearInSearchEngines}
            onClick={() => setAppearInSearchEngines((prev) => !prev)}
          />
        </div>
        <p className="font-thin">
          {appearInSearchEngines
            ? "A link to your site doesn't currently show up in search engine results. This could keep some guests from finding your site."
            : "A link to your site currently appears in search engines. This way guests can find your site without needing to memorize your URL."}
        </p>
      </div>
      <div className="px-8 pb-5">
        <h2 className="my-4 text-2xl font-bold">Privacy</h2>
        <div className="flex items-center justify-between pb-3">
          <Label htmlFor="password-toggle" className="text-md">
            Require a Password
          </Label>
          {isUpdatingWebsite ? (
            <LoadingSpinner size={20} />
          ) : (
            <Switch
              id="password-toggle"
              checked={website?.isPasswordEnabled}
              onClick={() => handleChange(!website?.isPasswordEnabled)}
            />
          )}
        </div>
        <p className="font-thin">
          {website?.isPasswordEnabled
            ? "Guests will be asked to enter a password before they may view your site."
            : "Anyone with a link to your site may view it."}
        </p>
        {website?.isPasswordEnabled && (
          <div className="pt-5">
            <div className="flex justify-between pb-2">
              <span>Guest Password</span>
              <button
                className={`text-${sharedStyles.primaryColor}`}
                onClick={() => setShowPasswordPage(true)}
              >
                Edit Password
              </button>
            </div>
            <span className="font-thin">{website?.password}</span>
          </div>
        )}
      </div>
      <div className="px-8 pb-5">
        <div className="flex justify-between">
          <h2 className="my-4 text-2xl font-bold">Your URL</h2>
          <button className={`text-${sharedStyles.primaryColor}`}>
            Edit URL
          </button>
        </div>
        <span>{website?.url}</span>
      </div>
      <div className="flex items-center justify-center border-b border-t py-10">
        <div className="flex gap-2">
          <BsTrash3 size={25} />
          <span className="text-lg underline">
            Deactivate your Wedding Website
          </span>
        </div>
      </div>
    </>
  );
};

type SetPasswordPageProps = {
  setShowPasswordPage: Dispatch<SetStateAction<boolean>>;
  password: string;
  updateWebsite: (args: TUpdateWebsiteParams) => void;
  isUpdatingWebsite: boolean;
};

const SetPasswordPage = ({
  setShowPasswordPage,
  password,
  updateWebsite,
  isUpdatingWebsite,
}: SetPasswordPageProps) => {
  const [passwordInput, setPasswordInput] = useState(password ?? "");

  return (
    <div>
      <div className="flex justify-between border-b p-5">
        <div className="flex gap-4">
          <span
            className="cursor-pointer"
            onClick={() => setShowPasswordPage(false)}
          >
            <GoArrowLeft size={28} />
          </span>
          <span className="border-r"></span>
          <h1 className="text-2xl font-bold">Set a Password</h1>
        </div>
      </div>
      <div className="px-5 py-7">
        <p className="mb-5 font-thin tracking-tight">
          Know who&apos;s in on your wedding plans by adding a password to your
          site. Make sure it&apos;s easy for guests to remember (and for you to
          share!).
        </p>
        <input
          placeholder="Guest Password"
          className="w-[100%] border p-3"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
      </div>
      <div
        className={`fixed bottom-0 flex flex-col gap-3 border-t px-8 py-5 ${sharedStyles.sidebarFormWidth}`}
      >
        <button
          disabled={isUpdatingWebsite}
          className={`w-[100%] ${sharedStyles.primaryButton({
            py: "py-2",
            isLoading: isUpdatingWebsite,
          })}`}
          onClick={() =>
            updateWebsite({
              isPasswordEnabled: true,
              password: passwordInput,
            })
          }
        >
          {isUpdatingWebsite ? "Processing..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

const EditUrlPage = () => {
  return <div></div>;
};
