"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import {
  useRsvpForm,
  useUpdateRsvpForm,
} from "../../contexts/rsvp-form-context";
import Link from "next/link";
import Image from "next/image";
import DefaultBanner from "../../images/default-banner.jpg";
import { IoMdClose } from "react-icons/io";
import FindYourInvitationForm from "./steps/find-your-invitation";
import ConfirmNameForm from "./steps/confirm-name";
import EventRsvpForm from "./steps/event-rsvp";
import QuestionShortAnswer from "./steps/question-short-answer";
import QuestionMultipleChoice from "./steps/question-multiple-choice";
import SendRsvp from "./steps/send-rsvp";
import MultistepRsvpForm from "./multi-step-form";
import SendNoteForm from "./steps/send-note";
import RsvpConfirmation from "../rsvp-confirmation";

import { type ReactNode } from "react";
import { type RsvpPageData } from "~/app/utils/shared-types";
import { useConfirmReloadPage } from "../../hooks";

type MainRsvpFormProps = {
  weddingData: RsvpPageData;
};

const NUM_STATIC_STEPS = 5; // find invitation step, confirm household step, final step, and confirmation

export default function MainRsvpForm({ weddingData }: MainRsvpFormProps) {
  const rsvpFormData = useRsvpForm();
  const updateRsvpForm = useUpdateRsvpForm();
  const [currentStep, setCurrentStep] = useState<number>(1);
  useConfirmReloadPage();
  useEffect(() => {
    updateRsvpForm({ weddingData });
  }, []);

  const submitRsvpForm = api.website.submitRsvpForm.useMutation({
    onSuccess: () => {
      setCurrentStep((prev) => prev + 1);
    },
  });
  const numSteps = useRef(NUM_STATIC_STEPS);
  const progress = (currentStep / numSteps.current) * 100;

  const generateDynamicStepForms = useCallback(() => {
    const newSteps = weddingData?.events?.reduce((acc: ReactNode[], event) => {
      const invitedGuests = rsvpFormData.selectedHousehold?.guests.filter(
        (guest) =>
          guest.invitations.some(
            (invite) =>
              invite.eventId === event.id &&
              ["Invited", "Attending", "Declined"].includes(invite.rsvp ?? ""),
          ),
      );

      if (invitedGuests !== undefined && invitedGuests.length > 0) {
        acc.push(
          <EventRsvpForm event={event} invitedGuests={invitedGuests} />,
          <QuestionShortAnswer />,
          <QuestionMultipleChoice />,
        );
        // TODO: when questions are implemented
        // for (let question of event.questions) {
        //   invitedGuests.forEach(guest => {
        //     if (question.type === 'text') acc.push(<QuestionShortAnswer question={question} guest={guest} event={event} />)
        //     else acc.push(<QuestionMultipleChoice question={question} guest={guest} event={event} />)
        //   })
        // }
      }
      return acc;
    }, []);
    numSteps.current = newSteps.length + NUM_STATIC_STEPS;
    return newSteps;
  }, [weddingData, rsvpFormData.selectedHousehold]);

  return (
    <div className="pb-20 font-serif">
      <ProgressBar
        currentStep={currentStep}
        progress={progress}
        numSteps={numSteps.current}
      />
      <Link href="/foobarandloremipsum" className="absolute right-3 top-2">
        <IoMdClose size={25} className="cursor-pointer" />
      </Link>
      {/* theme */}
      {/* <div className="mb-2.5 h-40 w-full bg-gray-200 dark:bg-gray-700"></div> */}
      <div className="relative h-48">
        <Image
          alt="Pink Romantic Fresh Art Wedding Banner Background from pngtree.com"
          src={DefaultBanner}
          fill
        />
      </div>
      <form
        className="m-auto w-[500px] py-5"
        onSubmit={(e) => {
          e.preventDefault();
          submitRsvpForm.mutate(rsvpFormData);
        }}
      >
        <MultistepRsvpForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        >
          <FindYourInvitationForm />
          <ConfirmNameForm />
          {...generateDynamicStepForms()}
          {/* TODO: replace SendNoteForm for logic similar to above except reducing over website.questions instead for "general" questions */}
          <SendNoteForm />
          <SendRsvp isFetching={submitRsvpForm.isLoading} />
          <RsvpConfirmation />
        </MultistepRsvpForm>
      </form>
    </div>
  );
}

const ProgressBar = ({
  currentStep,
  progress,
  numSteps,
}: {
  currentStep: number;
  progress: number;
  numSteps: number;
}) => {
  return (
    <div className="relative px-10 py-1 text-center">
      <h1 className="py-3 text-2xl">RSVP</h1>
      <div className="relative mb-2.5 h-3 w-full rounded-full bg-gray-200">
        <div
          className="absolute left-0 top-0 mb-2.5 h-3 rounded-full bg-gray-700 transition-[width]"
          style={{
            width:
              currentStep < 3
                ? "1%"
                : currentStep === numSteps - 1
                  ? "99%"
                  : `${progress}%`,
          }}
        ></div>
      </div>
    </div>
  );
};
