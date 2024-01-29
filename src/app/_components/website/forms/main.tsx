"use client";

import { useState } from "react";
import { useMultistepForm } from "../../hooks";
import { IoMdClose } from "react-icons/io";
import { sharedStyles } from "~/app/utils/shared-styles";

import FindYourInvitationForm from "./find-your-invitation";
import ConfirmNameForm from "./confirm-name";
import EventRsvpForm from "./event-rsvp";
import QuestionTextForm from "./question-text";
import QuestionOptionsForm from "./question-options";
import FinalStep from "./final-step";

import { type FormEvent } from "react";
import { type Guest, type WeddingData } from "~/app/utils/shared-types";

type FormData = {
  foobar: string;
};

const INITIAL_DATA: FormData = {
  foobar: "",
  // rsvp values for households + guests within their respective events
  // questions and their answers: free response and multi choice types
};

type MainRsvpFormProps = {
  weddingData: WeddingData;
  guestList: Guest[];
};

export default function MainRsvpForm({
  weddingData,
  guestList,
}: MainRsvpFormProps) {
  const [rsvpFormData, setRsvpFormData] = useState(INITIAL_DATA);
  function updateFields(fields: Partial<FormData>) {
    setRsvpFormData((prev) => {
      return { ...prev, ...fields };
    });
  }
  const {
    formStep,
    formSteps,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    back,
    next,
  } = useMultistepForm([
    <FindYourInvitationForm key="FindYourInvitationForm" />,
    <ConfirmNameForm key="ConfirmNameForm" />,
    // [...weddingData.events.map(event => <EventRsvpForm key={event.id} /> )],
    <EventRsvpForm key="EventRsvpForm" />,
    <QuestionTextForm key="QuestionTextForm" />,
    <QuestionOptionsForm key="QuestionOptionsForm" />,
    <FinalStep key="FinalStep" />,
  ]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLastStep) return next();
    alert("Submit Rsvp");
  }

  const progress = ((currentStepIndex + 1) / formSteps.length) * 100;

  return (
    <div className="font-serif">
      <div>
        <div className="relative px-10 py-1 text-center">
          <h1 className="py-3 text-2xl">RSVP</h1>
          {/* progress bar */}
          <div className="relative mb-2.5 h-3 w-full rounded-full bg-gray-200">
            <div
              className="absolute left-0 top-0 mb-2.5 h-3 rounded-full bg-gray-700 transition-[width]"
              style={{ width: isFirstStep ? "3%" : `${progress}%` }}
            ></div>
          </div>
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
      <form className="m-auto w-[500px] py-5">{formStep}</form>
      <button onClick={() => back()}>back</button>
      <button onClick={() => next()}>next</button>
    </div>
  );
}
