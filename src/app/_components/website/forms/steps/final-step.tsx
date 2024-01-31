"use client";

import { useState } from "react";

import { type StepFormProps } from "~/app/utils/shared-types";

export default function FinalStep({ goBack }: StepFormProps) {
  const [email, setEmail] = useState("");
  const weddingData = {
    groomFirstName: "foo",
    brideFirstName: "bar",
  };
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl tracking-widest">{`last step! send your rsvp to ${weddingData.groomFirstName} & ${weddingData.brideFirstName}'s wedding`}</h2>
      <div className="flex items-center gap-3">
        <input
          id="send-email-confirmation"
          type="checkbox"
          style={{ accentColor: "rgb(55 65 81)" }}
          className="h-6 w-6"
        />
        <label htmlFor="send-email-confirmation">
          Send me an RSVP confirmation by email
        </label>
      </div>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-3"
      />
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="submit"
      >
        SEND RSVP
      </button>
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="button"
        onClick={() => goBack && goBack()}
      >
        BACK
      </button>
      <p className="text-xs underline">View Our Privacy Policy</p>
    </div>
  );
}
