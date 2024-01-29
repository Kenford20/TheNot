"use client";

import { useState } from "react";

export default function ConfirmNameForm() {
  const [selectedHousehold, setSelectedHousehold] = useState<string>();

  const matchedHouseholds = [
    {
      id: "abc",
      guests: "guestsingle",
    },
    {
      id: "def",
      guests: "guest & guestagain",
    },
    {
      id: "xyz",
      guests: "guest1, guest2, & guest3",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl tracking-widest">
        we&apos;ve found you in the guest list. please confirm your name below
        to continue with your rsvp
      </h2>
      {matchedHouseholds.map((household) => {
        // would map thorugh guests and get their names here
        return (
          <div key={household.id} className="flex gap-5">
            <input
              type="radio"
              id={household.id}
              checked={selectedHousehold === household.id}
              onClick={() => setSelectedHousehold(household.id)}
            />
            <label htmlFor={household.id}>{household.guests}</label>
          </div>
        );
      })}

      <button
        className={`mt-3 bg-stone-400 py-3 text-xl tracking-wide text-white`}
        type="button"
      >
        CONTINUE
      </button>
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="button"
      >
        SEARCH AGAIN
      </button>
    </div>
  );
}
