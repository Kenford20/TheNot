"use client";

import { useRsvpForm } from "../contexts/rsvp-form-context";

export default function RsvpConfirmation() {
  const rsvpFormData = useRsvpForm();
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl tracking-widest">
        all set! here&apos;s what we sent{" "}
        {rsvpFormData.weddingData.groomFirstName} &{" "}
        {rsvpFormData.weddingData.brideFirstName}
      </h2>
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="submit"
        onClick={() =>
          (window.location =
            "home page - may need to pass path into context from page RSC")
        }
      >
        BACK TO HOMEPAGE
      </button>
    </div>
  );
}
