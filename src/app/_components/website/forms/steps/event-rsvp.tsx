"use client";

import { useState } from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { formatDateStandard } from "~/app/utils/helpers";

import { type StepFormProps } from "~/app/utils/shared-types";

export default function EventRsvpForm({ goNext, goBack }: StepFormProps) {
  const event = {
    id: "123",
    name: "Wedding Day",
    date: new Date("1/1/24"),
    startTime: "12:00 PM",
  };
  const invitedGuests = [
    {
      id: "1",
      firstName: "first",
      lastName: "guest",
    },
    {
      id: "2",
      firstName: "second",
      lastName: "guest",
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl tracking-widest">{event.name}</h2>
      <div className="flex gap-2">
        <AiOutlineCalendar size={20} />
        <span>
          {formatDateStandard(event.date)} at {event.startTime}
        </span>
      </div>
      <ul>
        {invitedGuests.map((guest) => {
          return (
            <li key={guest.id} className="mb-3">
              <div className="flex items-center justify-between">
                <span>
                  {guest.firstName} {guest.lastName}
                </span>
                <RsvpSelection guestId={guest.id} />
              </div>
            </li>
          );
        })}
      </ul>
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="button"
        onClick={() => goNext && goNext()}
      >
        CONTINUE
      </button>
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
        type="submit"
        onClick={() => goBack && goBack()}
      >
        BACK
      </button>
    </div>
  );
}

function RsvpSelection({ guestId }: { guestId: string }) {
  const [rsvpSelection, setRsvpSelection] = useState<"Accepted" | "Declined">();
  return (
    <div className="flex gap-3">
      <div
        className={`flex w-32 cursor-pointer items-center justify-center gap-1 border border-gray-400 py-2 text-gray-400 ${rsvpSelection === "Accepted" && "bg-gray-700 text-white"}`}
        onClick={() => setRsvpSelection("Accepted")}
      >
        {rsvpSelection === "Accepted" && <IoIosCheckmarkCircleOutline />}
        Accept
      </div>
      <div
        className={`flex w-32 cursor-pointer items-center justify-center gap-1 border border-gray-400 py-2 text-gray-400 ${rsvpSelection === "Declined" && "bg-gray-700 text-white"}`}
        onClick={() => setRsvpSelection("Declined")}
      >
        {rsvpSelection === "Declined" && <IoIosCheckmarkCircleOutline />}
        Decline
      </div>
    </div>
  );
}
