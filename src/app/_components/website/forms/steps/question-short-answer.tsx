"use client";

import { useState } from "react";
import {
  useRsvpForm,
  useUpdateRsvpForm,
} from "~/app/_components/contexts/rsvp-form-context";

import { type Guest, type StepFormProps } from "~/app/utils/shared-types";

interface QuestionShortAnswerProps extends StepFormProps {
  guest?: Guest;
  // question: Question
}

export default function QuestionShortAnswer({
  goNext,
  goBack,
  guest,
}: QuestionShortAnswerProps) {
  const rsvpFormData = useRsvpForm();
  const updateRsvpForm = useUpdateRsvpForm();
  const [answer, setAnswer] = useState("");

  const guestThatsAnswering = {
    firstName: "john",
    lastName: "doe",
  };
  const question = {
    text: "will you be bringing any children under the age of 10?",
    isRequired: false,
  };
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl tracking-widest">{question.text}</h2>
      <span>
        {guestThatsAnswering.firstName} {guestThatsAnswering.lastName}
      </span>
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
                questionId: "123",
                // TODO: update guestId when Questions are implemented - can remove optional in the prop types
                guestId: guest?.id ?? 0,
                response: {
                  type: "Text",
                  answer,
                },
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
