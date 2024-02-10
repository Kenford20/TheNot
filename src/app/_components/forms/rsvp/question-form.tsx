"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { sharedStyles } from "../../../utils/shared-styles";
import { IoMdClose } from "react-icons/io";
import SidePaneWrapper from "../wrapper";
import AnimatedInputLabel from "../animated-input-label";
import DeleteConfirmation from "../delete-confirmation";

import { type Dispatch, type SetStateAction } from "react";
import { type Option, type Question } from "~/app/utils/shared-types";
import { FiMinusCircle } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";

type TformOption = {
  text: string;
  description: string;
};

const defaultQuestionOptions: TformOption[] = [
  {
    text: "",
    description: "",
  },
  {
    text: "",
    description: "",
  },
];

type QuestionFormProps = {
  question: Question;
  setShowQuestionForm: Dispatch<SetStateAction<boolean>>;
};

export default function QuestionForm({
  question,
  setShowQuestionForm,
}: QuestionFormProps) {
  const router = useRouter();
  const [questionOptions, setQuestionOptions] = useState<
    Option[] | TformOption[]
  >(question.options ?? defaultQuestionOptions);
  const [questionType, setQuestionType] = useState<string>(
    question.type ?? "Text",
  );
  const [questionInput, setQuestionInput] = useState<string>(
    question.text ?? "",
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);

  const upsertQuestion = api.question.upsert.useMutation({
    onSuccess: () => {
      setShowQuestionForm(false);
      router.refresh();
    },
    onError: (err) => {
      if (err) window.alert(err);
      else window.alert("Failed to update question! Please try again later.");
    },
  });

  const deleteQuestion = api.question.delete.useMutation({
    onSuccess: () => {
      setShowQuestionForm(false);
      router.refresh();
    },
    onError: (err) => {
      if (err) window.alert(err);
      else window.alert("Failed to update question! Please try again later.");
    },
  });

  const handleOnChange = ({ inputValue }: { inputValue: string }) => {
    setQuestionInput(inputValue);
  };

  if (showDeleteConfirmation) {
    return (
      <DeleteConfirmation
        isProcessing={deleteQuestion.isLoading}
        disclaimerText={
          "This will permanently delete the question and any answers you've already received."
        }
        noHandler={() => setShowDeleteConfirmation(false)}
        yesHandler={() =>
          deleteQuestion.mutate({
            questionId: question.id,
          })
        }
      />
    );
  }

  return (
    <SidePaneWrapper>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          upsertQuestion.mutate({
            type: questionType,
            text: questionInput,
            eventId: question.eventId,
            websiteId: question.websiteId,
            questionId: question.id,
          });
        }}
        className="pb-32"
      >
        <div className="flex justify-between border-b p-5">
          <h1 className="text-xl font-semibold">Add Question</h1>
          <IoMdClose
            size={25}
            className="cursor-pointer"
            onClick={() => setShowQuestionForm(false)}
          />
        </div>
        <div className="bg-pink-100 px-5 py-3">
          <b>FYI: </b>
          <span>
            Guests can only skip short-answer questions. They must answer
            multiple-choice questions.
          </span>
        </div>
        <div className="mt-7 px-5">
          <AnimatedInputLabel
            id="question-input"
            inputValue={questionInput}
            labelText="Question Prompt*"
            required={true}
            handleOnChange={handleOnChange}
          />
          <div className="flex gap-5 py-5">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="short-answer"
                checked={questionType === "Text"}
                onChange={() => setQuestionType("Text")}
                className="h-6 w-6"
              />
              <label htmlFor="short-answer">Short Answer</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="multiple-choice"
                checked={questionType === "Option"}
                onChange={() => setQuestionType("Option")}
                className="h-6 w-6"
              />
              <label htmlFor="multiple-choice">Multiple Choice</label>
            </div>
          </div>
        </div>
        {questionType === "Option" && (
          <QuestionOptionsForm
            questionOptions={questionOptions}
            setQuestionOptions={setQuestionOptions}
          />
        )}
        <div
          className={`fixed bottom-0 z-20 flex ${sharedStyles.sidebarFormWidth} flex-col gap-3 border-t bg-white px-3 py-5`}
        >
          <div className="flex gap-3 text-sm">
            <button
              disabled={upsertQuestion.isLoading}
              onClick={() => setShowQuestionForm(false)}
              className={`w-1/2 ${sharedStyles.secondaryButton({
                py: "py-2",
                isLoading: upsertQuestion.isLoading,
              })}`}
            >
              Cancel
            </button>
            <button
              id="edit-save"
              name="edit-button"
              type="submit"
              disabled={upsertQuestion.isLoading}
              className={`w-1/2 ${sharedStyles.primaryButton({
                px: "px-2",
                py: "py-2",
                isLoading: upsertQuestion.isLoading,
              })}`}
            >
              {upsertQuestion.isLoading ? "Processing..." : "Save"}
            </button>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowDeleteConfirmation(true);
            }}
            className={`text-sm font-bold ${
              upsertQuestion.isLoading
                ? "cursor-not-allowed"
                : "hover:underline"
            } ${
              upsertQuestion.isLoading
                ? "text-pink-200"
                : `text-${sharedStyles.primaryColor}`
            }`}
          >
            {upsertQuestion.isLoading ? "Processing..." : "Delete Party"}
          </button>
        </div>
      </form>
    </SidePaneWrapper>
  );
}

type QuestionOptionsFormProps = {
  questionOptions: TformOption[] | Option[];
  setQuestionOptions: Dispatch<SetStateAction<Option[] | TformOption[]>>;
};

const QuestionOptionsForm = ({
  questionOptions,
  setQuestionOptions,
}: QuestionOptionsFormProps) => {
  return (
    <div className="px-5">
      {questionOptions.map((option, i) => {
        return (
          <QuestionOption
            key={i}
            option={option}
            setQuestionOptions={setQuestionOptions}
            questionIndex={i}
          />
        );
      })}
      <div
        className="flex cursor-pointer gap-2"
        onClick={() =>
          setQuestionOptions((prev) => [
            ...prev,
            {
              text: "",
              description: "",
            },
          ])
        }
      >
        <AiOutlinePlusCircle size={25} color={sharedStyles.primaryColorHex} />
        <span className={`text-${sharedStyles.primaryColor}`}>
          Add Another Option
        </span>
      </div>
    </div>
  );
};

type QuestionOptionProps = {
  option: Option | TformOption;
  setQuestionOptions: Dispatch<SetStateAction<Option[] | TformOption[]>>;
  questionIndex: number;
};

const QuestionOption = ({
  option,
  setQuestionOptions,
  questionIndex,
}: QuestionOptionProps) => {
  const handleRemoveOption = () => {
    setQuestionOptions((prev) => prev.filter((_, i) => i !== questionIndex));
  };

  const handleOnChange = ({
    field,
    inputValue,
  }: {
    field: string;
    inputValue: string;
  }) => {
    setQuestionOptions((prev) => {
      return {
        ...prev,
        [field]: inputValue,
      };
    });
  };

  return (
    <div className="flex w-full pb-5 pt-2">
      <FiMinusCircle
        size={32}
        color={questionIndex < 2 ? "lightgray" : "gray"}
        className={`-ml-0.5 mr-3 mt-2 ${questionIndex < 2 ? "cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => questionIndex > 1 && handleRemoveOption()}
      />
      <div className="flex w-full flex-col gap-3">
        <AnimatedInputLabel
          id="question-input"
          inputValue={option.text}
          fieldName="text"
          labelText="Option*"
          required={true}
          handleOnChange={handleOnChange}
        />
        <textarea
          placeholder="Description"
          value={option.description}
          onChange={(e) =>
            handleOnChange({ field: "description", inputValue: e.target.value })
          }
          className="h-24 w-full rounded-lg border p-3 text-sm"
          style={{ resize: "none" }}
        />
      </div>
    </div>
  );
};
