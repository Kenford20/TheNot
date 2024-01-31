import React, { type Dispatch, type SetStateAction } from "react";

type MultistepRsvpFormProps = {
  children: React.ReactNode;
  currentIndex: number;
  setCurrentStepIndex: Dispatch<SetStateAction<number>>;
};

export default function MultistepRsvpForm({
  children,
  currentIndex,
  setCurrentStepIndex,
}: MultistepRsvpFormProps) {
  const goNext = () => {
    setCurrentStepIndex((prev) => prev + 1);
  };
  const goBack = () => {
    setCurrentStepIndex((prev) => prev - 1);
  };

  const currentStepForm = React.Children.toArray(children)[currentIndex];

  if (
    React.isValidElement<{ goNext: () => void; goBack: () => void }>(
      currentStepForm,
    )
  ) {
    return React.cloneElement(currentStepForm, { goNext, goBack });
  }

  return currentStepForm;
}
