"use client";

import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { sharedStyles } from "~/app/utils/shared-styles";

import { type Guest, type WeddingData } from "~/app/utils/shared-types";

type FindYourInvitationFormProps = {
  weddingData: WeddingData;
  guestList: Guest[];
};

export default function FindYourInvitationForm({
  weddingData,
  guestList,
}: FindYourInvitationFormProps) {
  const [name, setName] = useState<string>();

  return (
    <div className="font-serif">
      <div>
        <div className="relative px-10 py-1 text-center">
          <h1 className="py-3 text-2xl">RSVP</h1>
          {/* progress bar */}
          <div className="mb-2.5 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="absolute right-3 top-2">
          <IoMdClose
            size={25}
            className="cursor-pointer"
            onClick={() => window.alert("close")}
          />
        </div>
      </div>
      {/* theme */}
      <div className="mb-2.5 h-48 w-full bg-gray-200 dark:bg-gray-700"></div>
      <form className="m-auto w-[500px] py-5">
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
          <button
            className={`mt-3 bg-gray-400 py-3 text-xl tracking-wide text-white`}
            type="submit"
          >
            FIND YOUR INVITATION
          </button>
        </div>
      </form>
    </div>
  );
}
