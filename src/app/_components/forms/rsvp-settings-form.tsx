"use client";

import { sharedStyles } from "~/app/utils/shared-styles";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { TiEyeOutline } from "react-icons/ti";
import { Switch } from "~/components/ui/switch";
import { GoArrowLeft } from "react-icons/go";
import { useScrollToTop } from "../hooks";
import QuestionForm from "./rsvp/question-form";

import { useState, type Dispatch, type SetStateAction } from "react";
import {
  type Event,
  type DashboardData,
  type Question,
} from "~/app/utils/shared-types";

export default function RsvpSettingsForm({
  dashboardData,
  setShowRsvpSettings,
}: {
  dashboardData: DashboardData;
  setShowRsvpSettings: Dispatch<SetStateAction<boolean>>;
}) {
  useScrollToTop();
  const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false);
  const [prefillQuestion, setPrefillQuestion] = useState<Question>();

  return (
    <>
      {showQuestionForm && (
        <QuestionForm
          question={prefillQuestion!}
          setShowQuestionForm={setShowQuestionForm}
        />
      )}
      <div className="absolute left-0 top-0 flex h-[120px] w-screen items-center bg-white pl-10">
        <div
          className="flex cursor-pointer gap-3"
          onClick={() => setShowRsvpSettings(false)}
        >
          <GoArrowLeft size={36} />
          <span className="text-2xl font-semibold">Online RSVP</span>
        </div>
      </div>
      <div className="m-auto w-[750px]">
        <div className="mt-10 flex items-center gap-2 bg-blue-50 p-4">
          <TiEyeOutline size={30} color="blue" />
          <p>
            This form is <b>visible</b> on your Website. Guests on your Guest
            List can RVSP <button className="underline">View Settings</button>
          </p>
        </div>
        <ul>
          {dashboardData?.events.map((event) => {
            const { attending, invited, declined } = event.guestResponses;
            const numGuests = attending + invited + declined;
            return (
              <section key={event.id} className="border-b py-10">
                <EventRsvpSection
                  event={event}
                  numGuests={numGuests}
                  setPrefillQuestion={setPrefillQuestion}
                  setShowQuestionForm={setShowQuestionForm}
                />
              </section>
            );
          })}
        </ul>
        <GeneralQuestionsSection
          generalQuestions={
            dashboardData?.weddingData.website?.generalQuestions ?? []
          }
        />
      </div>
    </>
  );
}

type EventRsvpSectionProps = {
  event: Event;
  numGuests: number;
  setPrefillQuestion: Dispatch<SetStateAction<Question | undefined>>;
  setShowQuestionForm: Dispatch<SetStateAction<boolean>>;
};

const EventRsvpSection = ({
  event,
  numGuests,
  setPrefillQuestion,
  setShowQuestionForm,
}: EventRsvpSectionProps) => {
  const onAddQuestion = (eventId: string) => {
    setPrefillQuestion({
      id: "",
      eventId,
      text: "",
      type: "Text",
      isRequired: false,
    });
    setShowQuestionForm(true);
  };
  return (
    <div>
      <div className="flex items-center justify-between pb-5">
        <h2 className="text-2xl font-bold">{event.name}</h2>
        <div className="flex items-center gap-3">
          <span>Collect RSVPs</span>
          <Switch id={`${event.id}-rsvp-toggle`} />
        </div>
      </div>
      <p>
        Questions will be asked to all of the {numGuests} guests on the{" "}
        <span className="font-semibold underline">{event.name}</span> list who
        RSVP &apos;Yes&apos;
      </p>
      <ul>
        {event.questions?.map((question) => {
          return (
            <li key={question.id} className="border-2 p-5">
              <div>
                <p>{question.text}</p>
                <BsPencil
                  size={20}
                  color={sharedStyles.primaryColorHex}
                  onClick={() => setPrefillQuestion(question)}
                />
              </div>
            </li>
          );
        })}
        <div
          className="flex cursor-pointer gap-2 pt-5"
          onClick={() => onAddQuestion(event.id)}
        >
          <AiOutlinePlusCircle size={25} color={sharedStyles.primaryColorHex} />
          <span className={`text-${sharedStyles.primaryColor}`}>
            Add a Follow-Up Question
          </span>
        </div>
      </ul>
    </div>
  );
};

const GeneralQuestionsSection = ({
  generalQuestions,
}: {
  generalQuestions: Question[];
}) => {
  return (
    <div className="py-10">
      <h1 className="py-5 text-2xl font-bold">General Questions</h1>
      <p>
        These questions will be asked of all guests that RSVP, regardless of if
        they say &apos;Yes&apos; or &apos;No&apos;
      </p>
      <ul>
        {generalQuestions.map((question) => {
          return (
            <li key={question.id} className="border-2 p-5">
              <div>
                <p>{question.text}</p>
                <BsPencil size={20} color={sharedStyles.primaryColorHex} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
