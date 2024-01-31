"use client";

import { createContext, useContext, useState } from "react";
import { type ReactNode } from "react";

type RsvpFormState = {
  foobar?: string;
  matches?: unknown;
};

const INITIAL_STATE: RsvpFormState = {
  foobar: "baz",
  // rsvp values for households + guests within their respective events
  // questions and their answers: free response and multi choice types
};

const RsvpFormContext = createContext(INITIAL_STATE);
const RsvpFormUpdateContext = createContext(
  (fields: Partial<RsvpFormState>) => {
    return;
  },
);

interface RsvpFormProviderProps {
  children?: ReactNode;
}

export const useRsvpForm = () => {
  return useContext(RsvpFormContext);
};

export const useUpdateRsvpForm = () => {
  return useContext(RsvpFormUpdateContext);
};

export const RsvpFormProvider = ({ children }: RsvpFormProviderProps) => {
  const [rsvpFormData, setRsvpFormData] =
    useState<RsvpFormState>(INITIAL_STATE);

  const updateFields = (fields: Partial<RsvpFormState>) => {
    setRsvpFormData((prev) => {
      return { ...prev, ...fields };
    });
  };

  return (
    <RsvpFormContext.Provider value={rsvpFormData}>
      <RsvpFormUpdateContext.Provider value={updateFields}>
        {children}
      </RsvpFormUpdateContext.Provider>
    </RsvpFormContext.Provider>
  );
};
