"use client";

import { useState } from "react";

import { type StepFormProps } from "~/app/utils/shared-types";

export default function QuestionTextForm({ goNext, goBack }: StepFormProps) {
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
        className="h-40 border"
      />
      <button
        className={`mt-3 bg-stone-400 py-3 text-xl tracking-wide text-white`}
        type="button"
        onClick={() => goNext && goNext()}
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
