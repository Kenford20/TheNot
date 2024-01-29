"use client";

import { useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export default function QuestionOptionsForm() {
  const [selectedOption, setSelectedOption] = useState<number | undefined>();
  const question = {
    text: "What music?",
    isRequired: true,
    options: [
      {
        id: "1",
        text: "option title",
        description: "option description",
      },
      {
        id: "2",
        text: "option title2",
        description: "option description2",
      },
    ],
  };
  const guestThatsAnswering = {
    firstName: "john",
    lastName: "doe",
  };
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl tracking-widest">{question.text}</h2>
      <span>
        {guestThatsAnswering.firstName} {guestThatsAnswering.lastName}
      </span>
      <ul>
        {question.options.map((option, i) => {
          return (
            <li
              key={option.id}
              onClick={() => setSelectedOption(i)}
              className={`relative mb-3 rounded-lg border border-gray-700 p-5 hover:bg-gray-700 hover:text-white ${selectedOption === i && "bg-gray-700 text-white"}`}
            >
              <div className="flex flex-col gap-3">
                <h3>{option.text}</h3>
                <p>{option.description}</p>
              </div>
              {selectedOption === i && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <IoIosCheckmarkCircleOutline size={20} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <button
        className={`mt-3 bg-gray-700 py-3 text-xl tracking-wide text-white`}
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
