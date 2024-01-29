"use client";

import { useState } from "react";

export default function QuestionTextForm() {
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
        onClick={() =>
          console.log("invoke function to move to next step of form")
        }
      >
        CONTINUE
      </button>
      {!question.isRequired && (
        <button
          className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
          type="button"
        >
          SKIP
        </button>
      )}
    </div>
  );
}
