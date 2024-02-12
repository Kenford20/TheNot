import { AiOutlinePlusCircle } from "react-icons/ai";
import { sharedStyles } from "~/app/utils/shared-styles";
import QuestionOption from "./question-option";

import { type Dispatch, type SetStateAction } from "react";
import { type Option } from "~/app/utils/shared-types";

type TformOption = {
  text: string;
  description: string;
};

type QuestionOptionsFormProps = {
  questionOptions: TformOption[] | Option[];
  setQuestionOptions: Dispatch<SetStateAction<Option[] | TformOption[]>>;
};

export default function QuestionOptionsForm({
  questionOptions,
  setQuestionOptions,
}: QuestionOptionsFormProps) {
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
}
