"use client";

import { useState, useEffect } from "react";
import { sharedStyles } from "~/app/utils/shared-styles";
import WeddingWebsite from "./wedding";

import { type Website } from "~/app/utils/shared-types";

type PasswordPageProps = {
  website: Website;
  // children: React.ReactNode,
};

export default function PasswordPage({ website }: PasswordPageProps) {
  const [passwordInput, setPasswordInput] = useState("");
  const [showError, setShowError] = useState(false);
  const [submittedPassword, setSubmittedPassword] = useState("");
  useEffect(() => {
    setSubmittedPassword(
      sessionStorage.getItem("wws_password") ?? submittedPassword ?? "",
    );
  }, [submittedPassword]);

  const verifyPassword = () => {
    if (website.password === passwordInput) {
      setSubmittedPassword(passwordInput);
      sessionStorage.setItem("wws_password", passwordInput);
    } else {
      setShowError(true);
    }
  };

  return !website?.isPasswordEnabled ||
    (website.password !== null && submittedPassword === website?.password) ? (
    <div>WeddingWebsite</div> // <WeddingWebsite /> serverCompoonent that needs to be passed as a prop to this client component
  ) : (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-5 text-2xl">Enter password to view this site</h1>
        <div className="flex gap-5">
          <input
            type="password"
            value={passwordInput}
            placeholder="Password"
            className="rounded-full border-2 px-5 py-3"
            onChange={(e) => {
              setShowError(false);
              setPasswordInput(e.target.value);
            }}
          />
          <button
            className={`${sharedStyles.primaryButton()}`}
            onClick={() => verifyPassword()}
          >
            SUBMIT
          </button>
        </div>
        {showError && <p className="mt-5">Incorrect Password</p>}
      </div>
    </div>
  );
}
