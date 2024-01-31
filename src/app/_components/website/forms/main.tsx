"use client";

import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { sharedStyles } from "~/app/utils/shared-styles";

import FindYourInvitationForm from "./steps/find-your-invitation";
import ConfirmNameForm from "./steps/confirm-name";
import EventRsvpForm from "./steps/event-rsvp";
import QuestionTextForm from "./steps/question-text";
import QuestionOptionsForm from "./steps/question-options";
import FinalStep from "./steps/final-step";

import { type FormEvent } from "react";
import { type Guest, type WeddingData } from "~/app/utils/shared-types";
import MultistepRsvpForm from "./multi-step-form";
import Link from "next/link";
import SendNoteForm from "./steps/send-note";
import { useRsvpForm } from "../../contexts/rsvp-form-context";

type MainRsvpFormProps = {
  weddingData: WeddingData;
  guestList: Guest[];
};

export default function MainRsvpForm({
  weddingData,
  guestList,
}: MainRsvpFormProps) {
  const rsvpFormData = useRsvpForm();
  console.log("form", rsvpFormData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [numSteps, setNumSteps] = useState(8);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    alert("Submit Rsvp");
  }

  const progress = ((currentStepIndex + 1) / numSteps) * 100;

  return (
    <div className="pb-20 font-serif">
      <ProgressBar currentStepIndex={currentStepIndex} progress={progress} />
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
          <EventRsvpForm />
          <QuestionTextForm />
          <QuestionOptionsForm />
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
