"use client";

import { useState } from "react";
import {
  useRsvpForm,
  useUpdateRsvpForm,
} from "~/app/_components/contexts/rsvp-form-context";

import {
  type Question,
  type Guest,
  type StepFormProps,
} from "~/app/utils/shared-types";

interface QuestionShortAnswerProps extends StepFormProps {
  guest?: Guest;
  question: Question;
}

export default function QuestionShortAnswer({
  goNext,
  goBack,
  guest,
  question,
}: QuestionShortAnswerProps) {
  const rsvpFormData = useRsvpForm();
  const updateRsvpForm = useUpdateRsvpForm();
  const [answer, setAnswer] = useState("");

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl tracking-widest">{question.text}</h2>
      {!!guest && (
        <span>
          {guest.firstName} {guest.lastName}
        </span>
      )}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="h-40 border p-3"
      />
      <button
        className={`mt-3 bg-stone-400 py-3 text-xl tracking-wide text-white ${answer.length === 0 ? "cursor-not-allowed bg-stone-400" : "bg-stone-700"}`}
        type="button"
        onClick={() => {
          updateRsvpForm({
            answersToQuestions: [
              ...rsvpFormData.answersToQuestions,
              {
                questionId: question.id ?? "-1",
                guestId: guest?.id ?? 0,
                householdId: rsvpFormData.selectedHousehold?.id,
                response: answer,
                guestFirstName: guest?.firstName,
                guestLastName: guest?.lastName,
              },
            ],
          });
          goNext && goNext();
        }}
      >
        CONTINUE
      </button>
      {!question.isRequired && (
        <button
          className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
          type="button"
          onClick={() => goNext && goNext()}
        >
          SKIP
        </button>
      )}
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
