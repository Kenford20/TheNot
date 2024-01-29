"use client";

import { useState } from "react";

export default function FindYourInvitationForm() {
  const [name, setName] = useState<string>();
  const [showError, setShowError] = useState<boolean>(false);

  const weddingData = {
    groomFirstName: "test",
    brideFirstName: "weebar",
  };

  const findInvitation = () => {
    // api call and query against input?
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl tracking-widest">{`${weddingData.groomFirstName} & ${weddingData.brideFirstName}'s wedding`}</h2>
      <p className="mb-3 font-thin">
        If you&apos;re responding for you and a guest (or for your family),
        you&apos;ll be able to RSVP for your entire group.
      </p>
      <input
        placeholder="Full Name"
        className="border border-gray-400 p-3"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      {showError && (
        <p className="text-xs">
          Oops! We&apos;re having trouble finding your invite. Please try
          another spelling of your name or contact the couple
        </p>
      )}
      <button
        className={`mt-3 bg-stone-400 py-3 text-xl tracking-wide text-white`}
        type="button"
        onClick={() => findInvitation()}
      >
        FIND YOUR INVITATION
      </button>
    </div>
  );
}
