"use client";

import { useState } from "react";
import {
  useRsvpForm,
  useUpdateRsvpForm,
} from "~/app/_components/contexts/rsvp-form-context";

import { type StepFormProps } from "~/app/utils/shared-types";

export default function ConfirmNameForm({ goNext, goBack }: StepFormProps) {
  const { matchedHouseholds } = useRsvpForm();
  const updateRsvpForm = useUpdateRsvpForm();
  const [selectedHousehold, setSelectedHousehold] = useState<string>();

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl tracking-widest">
        we&apos;ve found you in the guest list. please confirm your name below
        to continue with your rsvp
      </h2>
      {matchedHouseholds?.map((household) => {
        return (
          <div key={household.id} className="flex gap-5">
            <input
              type="radio"
              id={household.id}
              checked={selectedHousehold === household.id}
              onChange={() => setSelectedHousehold(household.id)}
            />
            <label htmlFor={household.id}>
              {household.guests
                .map((guest) => `${guest.firstName} ${guest.lastName}`)
                .join(", ")}
            </label>
          </div>
        );
      })}

      <button
        className={`mt-3 bg-stone-400 py-3 text-xl tracking-wide text-white ${selectedHousehold === undefined ? "cursor-not-allowed bg-stone-400" : "bg-stone-700"}`}
        type="button"
        disabled={selectedHousehold === undefined}
        onClick={() => {
          updateRsvpForm({
            selectedHousehold: matchedHouseholds?.find(
              (household) => household.id === selectedHousehold,
            ),
          });
          goNext && goNext();
        }}
      >
        CONTINUE
      </button>
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="button"
        onClick={() => goBack && goBack()}
      >
        SEARCH AGAIN
      </button>
    </div>
  );
}
