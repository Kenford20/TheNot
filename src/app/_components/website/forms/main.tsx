"use client";

import { useEffect, useRef, useState } from "react";
import {
  useRsvpForm,
  useUpdateRsvpForm,
} from "../../contexts/rsvp-form-context";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import FindYourInvitationForm from "./steps/find-your-invitation";
import ConfirmNameForm from "./steps/confirm-name";
import EventRsvpForm from "./steps/event-rsvp";
import QuestionTextForm from "./steps/question-text";
import QuestionOptionsForm from "./steps/question-options";
import FinalStep from "./steps/final-step";
import MultistepRsvpForm from "./multi-step-form";
import SendNoteForm from "./steps/send-note";

import { type FormEvent } from "react";
import { type RsvpPageData } from "~/app/utils/shared-types";
import React from "react";

type MainRsvpFormProps = {
  weddingData: RsvpPageData;
};

const NUM_STATIC_STEPS = 3; // find invitation step, confirm household step, and final step

export default function MainRsvpForm({ weddingData }: MainRsvpFormProps) {
  const { selectedHousehold } = useRsvpForm();
  const updateRsvpForm = useUpdateRsvpForm();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    updateRsvpForm({ weddingData });
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    alert("Submit Rsvp");
  }

  const progress = useRef(((currentStepIndex + 1) / NUM_STATIC_STEPS) * 100);

  const generateDynamicStepForms = () => {
    const newSteps = weddingData?.events?.reduce(
      (acc: React.ReactNode[], event) => {
        const invitedGuests = selectedHousehold?.guests.filter((guest) =>
          guest.invitations.some(
            (invite) =>
              invite.eventId === event.id &&
              ["Invited", "Accepted", "Declined"].includes(invite.rsvp ?? ""),
          ),
        );

        if (invitedGuests !== undefined && invitedGuests.length > 0) {
          acc.push(
            <EventRsvpForm event={event} invitedGuests={invitedGuests} />,
            <QuestionTextForm />,
            <QuestionOptionsForm />,
          );
          // TODO: when questions are implemented
          // for (let question of event.questions) {
          //   invitedGuests.forEach(guest => {
          //     if (question.type === 'text') acc.push(<QuestionTextForm question={question} guest={guest} />)
          //     else acc.push(<QuestionOptionsForm question={question} guest={guest}/>)
          //   })
          // }
        }
        return acc;
      },
      [],
    );
    progress.current =
      ((currentStepIndex + 1) / (newSteps.length + NUM_STATIC_STEPS)) * 100;
    return newSteps;
  };

  return (
    <div className="pb-20 font-serif">
      <ProgressBar
        currentStepIndex={currentStepIndex}
        progress={progress.current}
      />
      <Link href="/foobarandloremipsum" className="absolute right-3 top-2">
        <IoMdClose size={25} className="cursor-pointer" />
      </Link>
      {/* theme */}
      <div className="mb-2.5 h-40 w-full bg-gray-200 dark:bg-gray-700"></div>
      <form className="m-auto w-[500px] py-5">
        <MultistepRsvpForm
          currentIndex={currentStepIndex}
          setCurrentStepIndex={setCurrentStepIndex}
        >
          <FindYourInvitationForm />
          <ConfirmNameForm />
          {...generateDynamicStepForms()}
          {/* TODO: replace SendNoteForm for logic similar to above except reducing over website.questions instead for "general" questions */}
          <SendNoteForm />
          <FinalStep />
        </MultistepRsvpForm>
      </form>
    </div>
  );
}

const ProgressBar = ({
  currentStepIndex,
  progress,
}: {
  currentStepIndex: number;
  progress: number;
}) => {
  return (
    <div className="relative px-10 py-1 text-center">
      <h1 className="py-3 text-2xl">RSVP</h1>
      <div className="relative mb-2.5 h-3 w-full rounded-full bg-gray-200">
        <div
          className="absolute left-0 top-0 mb-2.5 h-3 rounded-full bg-gray-700 transition-[width]"
          style={{ width: currentStepIndex < 2 ? "3%" : `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
