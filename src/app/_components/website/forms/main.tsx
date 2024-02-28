"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import {
  useRsvpForm,
  useUpdateRsvpForm,
} from "../../contexts/rsvp-form-context";
import { useConfirmReloadPage } from "../../hooks";
import { IoMdClose } from "react-icons/io";
import FindYourInvitationForm from "./steps/find-your-invitation";
import ConfirmNameForm from "./steps/confirm-name";
import EventRsvpForm from "./steps/event-rsvp";
import QuestionShortAnswer from "./steps/question-short-answer";
import QuestionMultipleChoice from "./steps/question-multiple-choice";
import SendRsvp from "./steps/send-rsvp";
import MultistepRsvpForm from "./multi-step-form";
import RsvpConfirmation from "../rsvp-confirmation";

import { type ReactNode } from "react";
import { type RsvpPageData } from "~/app/utils/shared-types";

type MainRsvpFormProps = {
  weddingData: RsvpPageData;
  basePath: string;
};

const NUM_STATIC_STEPS = 5; // find invitation step, confirm household step, final step, and confirmation

export default function MainRsvpForm({
  weddingData,
  basePath,
}: MainRsvpFormProps) {
  const rsvpFormData = useRsvpForm();
  const numSteps = useRef(NUM_STATIC_STEPS);
  const updateRsvpForm = useUpdateRsvpForm();
  const [currentStep, setCurrentStep] = useState<number>(1);
  useConfirmReloadPage(currentStep > 1 && currentStep < numSteps.current);
  useEffect(() => {
    updateRsvpForm({ weddingData });
  }, []);

  const submitRsvpForm = api.website.submitRsvpForm.useMutation({
    onSuccess: () => {
      setCurrentStep((prev) => prev + 1);
    },
  });
  const progress = (currentStep / numSteps.current) * 100;

  const generateDynamicStepForms = useCallback(() => {
    const newSteps = weddingData?.events?.reduce((acc: ReactNode[], event) => {
      if (!event.collectRsvp) return acc;
      // TODO: invitedGuests need to be filtered based on rsvp selection - shouldnt show question step forms for those who declined rsvp
      const invitedGuests = rsvpFormData.selectedHousehold?.guests.filter(
        (guest) =>
          guest.invitations.some(
            (invite) =>
              invite.eventId === event.id &&
              ["Invited", "Attending", "Declined"].includes(invite.rsvp ?? ""),
          ),
      );

      if (invitedGuests !== undefined && invitedGuests.length > 0) {
        acc.push(<EventRsvpForm event={event} invitedGuests={invitedGuests} />);
        for (const question of event.questions) {
          invitedGuests.forEach((guest) => {
            question.type === "Text"
              ? acc.push(
                  <QuestionShortAnswer question={question} guest={guest} />,
                )
              : acc.push(
                  <QuestionMultipleChoice question={question} guest={guest} />,
                );
          });
        }
      }
      return acc;
    }, []);

    weddingData?.website.generalQuestions.forEach((question) => {
      question.type === "Text"
        ? newSteps.push(<QuestionShortAnswer question={question} />)
        : newSteps.push(<QuestionMultipleChoice question={question} />);
    });

    numSteps.current = newSteps.length + NUM_STATIC_STEPS;
    return newSteps;
  }, [weddingData, rsvpFormData.selectedHousehold]);

  return (
    <div className="pb-20 font-serif">
      <ProgressBar
        currentStep={currentStep}
        progress={progress}
        numSteps={numSteps.current}
        basePath={basePath}
      />
      <form
        className="m-auto w-[450px] py-5"
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
          <SendRsvp isFetching={submitRsvpForm.isLoading} />
          <RsvpConfirmation
            basePath={basePath}
            setCurrentStep={setCurrentStep}
          />
        </MultistepRsvpForm>
      </form>
    </div>
  );
}

const ProgressBar = ({
  currentStep,
  progress,
  numSteps,
  basePath,
}: {
  currentStep: number;
  progress: number;
  numSteps: number;
  basePath: string;
}) => {
  return (
    <div className="fixed top-0 z-10 w-full bg-white px-10 py-1 text-center">
      <IoMdClose
        size={25}
        className="absolute right-3 top-2 z-20 cursor-pointer"
        onClick={() => {
          if (
            currentStep > 1 &&
            window.confirm("Are you sure? Your RSVP has not been sent.")
          ) {
            window.location.href = basePath;
          }
        }}
      />
      <h1 className="py-3 text-2xl">RSVP</h1>
      <div className="relative mb-2.5 h-3 w-full rounded-full bg-gray-200">
        <div
          className="absolute left-0 top-0 mb-2.5 h-3 rounded-full bg-gray-700 transition-[width]"
          style={{
            width:
              currentStep < 3
                ? "3%"
                : currentStep === numSteps - 1
                  ? "99%"
                  : `${progress}%`,
          }}
        ></div>
      </div>
    </div>
  );
};
