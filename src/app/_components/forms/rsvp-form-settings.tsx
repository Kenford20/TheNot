"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useToggleEditRsvpSettingsForm } from "../contexts/edit-rsvp-settings-form-context";
import { sharedStyles } from "~/app/utils/shared-styles";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { TiEyeOutline } from "react-icons/ti";
import { Switch } from "~/components/ui/switch";
import { GoArrowLeft } from "react-icons/go";
import { useScrollToTop } from "../hooks";
import { LoadingSpinner } from "../loaders";
import QuestionForm from "./question-form";

import { useState, type Dispatch, type SetStateAction } from "react";
import {
  type Event,
  type DashboardData,
  type Question,
  type Website,
} from "~/app/utils/shared-types";

export default function RsvpFormSettings({
  dashboardData,
  setShowRsvpSettings,
}: {
  dashboardData: DashboardData;
  setShowRsvpSettings: Dispatch<SetStateAction<boolean>>;
}) {
  useScrollToTop();
  const toggleEditRsvpSettingsForm = useToggleEditRsvpSettingsForm();
  const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false);
  const [prefillQuestion, setPrefillQuestion] = useState<Question>();
  const [useEditMode, setUseEditMode] = useState<boolean>(false);

  return (
    <>
      {showQuestionForm && (
        <QuestionForm
          isEditMode={useEditMode}
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
            List can RVSP{" "}
            <button className="underline" onClick={toggleEditRsvpSettingsForm}>
              View Settings
            </button>
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
                  setUseEditMode={setUseEditMode}
                  setPrefillQuestion={setPrefillQuestion}
                  setShowQuestionForm={setShowQuestionForm}
                />
              </section>
            );
          })}
        </ul>
        <GeneralQuestionsSection
          website={dashboardData?.weddingData.website}
          setUseEditMode={setUseEditMode}
          setPrefillQuestion={setPrefillQuestion}
          setShowQuestionForm={setShowQuestionForm}
        />
      </div>
    </>
  );
}

type EventRsvpSectionProps = {
  event: Event;
  numGuests: number;
  setUseEditMode: Dispatch<SetStateAction<boolean>>;
  setPrefillQuestion: Dispatch<SetStateAction<Question | undefined>>;
  setShowQuestionForm: Dispatch<SetStateAction<boolean>>;
};

const EventRsvpSection = ({
  event,
  numGuests,
  setUseEditMode,
  setPrefillQuestion,
  setShowQuestionForm,
}: EventRsvpSectionProps) => {
  const router = useRouter();
  const updateEventRsvpSetting = api.event.updateCollectRsvp.useMutation({
    onSuccess: () => router.refresh(),
    onError: (err) => {
      if (err) window.alert(err);
      else window.alert("Failed to update event! Please try again later.");
    },
  });

  const onAddQuestion = (eventId: string) => {
    setPrefillQuestion({
      id: undefined,
      eventId,
      text: "",
      type: "Text",
      isRequired: false,
    });
    setShowQuestionForm(true);
  };
  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-2xl font-bold">{event.name}</h2>
        <div className="flex items-center gap-3">
          <span>Collect RSVPs</span>
          {updateEventRsvpSetting.isLoading ? (
            <LoadingSpinner size={20} />
          ) : (
            <Switch
              id={`${event.id}-rsvp-toggle`}
              checked={event.collectRsvp}
              onClick={() =>
                updateEventRsvpSetting.mutate({
                  eventId: event.id,
                  collectRsvp: !event.collectRsvp,
                })
              }
            />
          )}
        </div>
      </div>
      <p>
        Questions will be asked to all of the {numGuests} guests on the{" "}
        <span className="font-semibold underline">{event.name}</span> list who
        RSVP &apos;Yes&apos;
      </p>
      <ul className="mt-5 flex flex-col gap-3">
        {event.questions?.map((question) => {
          return (
            <li key={question.id} className="border-2 p-4">
              <div className="flex items-center justify-between">
                {question.type === "Text" ? (
                  <p>{question.text}</p>
                ) : (
                  <div>
                    <p>{question.text}</p>
                    <span className="text-sm">
                      {question.options?.length} options
                    </span>
                  </div>
                )}
                <BsPencil
                  size={20}
                  color={sharedStyles.primaryColorHex}
                  className="cursor-pointer"
                  onClick={() => {
                    setUseEditMode(true);
                    setPrefillQuestion(question);
                    setShowQuestionForm(true);
                  }}
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

type GeneralQuestionsSectionProps = {
  website: Website | undefined | null;
  setUseEditMode: Dispatch<SetStateAction<boolean>>;
  setPrefillQuestion: Dispatch<SetStateAction<Question | undefined>>;
  setShowQuestionForm: Dispatch<SetStateAction<boolean>>;
};

const GeneralQuestionsSection = ({
  website,
  setUseEditMode,
  setPrefillQuestion,
  setShowQuestionForm,
}: GeneralQuestionsSectionProps) => {
  if (!website)
    return <div>Could not load questions. Please refresh the page.</div>;
  const onAddQuestion = (websiteId: string) => {
    setUseEditMode(false);
    setPrefillQuestion({
      id: "",
      websiteId,
      text: "",
      type: "Text",
      isRequired: false,
    });
    setShowQuestionForm(true);
  };
  return (
    <div className="py-10">
      <h1 className="py-2 text-2xl font-bold">General Questions</h1>
      <p>
        These questions will be asked of all guests that RSVP, regardless of if
        they say &apos;Yes&apos; or &apos;No&apos;
      </p>
      <ul className="mt-5 flex flex-col gap-3">
        {website?.generalQuestions?.map((question) => {
          return (
            <li key={question.id} className="border-2 p-4">
              <div className="flex justify-between">
                <p>{question.text}</p>
                <BsPencil
                  size={20}
                  color={sharedStyles.primaryColorHex}
                  className="cursor-pointer"
                  onClick={() => {
                    setUseEditMode(true);
                    setPrefillQuestion(question);
                    setShowQuestionForm(true);
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div
        className="flex w-fit cursor-pointer gap-2 pt-5"
        onClick={() => onAddQuestion(website.id)}
      >
        <AiOutlinePlusCircle size={25} color={sharedStyles.primaryColorHex} />
        <span className={`text-${sharedStyles.primaryColor}`}>
          Add Another Question
        </span>
      </div>
    </div>
  );
};
