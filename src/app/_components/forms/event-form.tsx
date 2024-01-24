"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDisablePageScroll } from "../hooks";
import { useToggleEventForm } from "../contexts/event-form-context";
import { api } from "~/trpc/react";
import { sharedStyles } from "../../utils/shared-styles";
import { IoMdClose } from "react-icons/io";
import DeleteConfirmation from "./delete-confirmation";
import DateInput from "./event/date-input";
import TimeSelections from "./event/time-selections";

import { type EventFormData } from "../../utils/shared-types";
import AnimatedInputLabel from "./animated-input-label";

type EventFormProps = {
  prefillFormData: EventFormData | undefined;
};

const defaultFormData = {
  eventName: "",
  date: undefined,
  startTime: undefined,
  endTime: undefined,
  venue: undefined,
  attire: undefined,
  description: undefined,
  eventId: "",
};

export default function EventForm({ prefillFormData }: EventFormProps) {
  const isEditMode = !!prefillFormData;
  const router = useRouter();
  const toggleEventForm = useToggleEventForm();

  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [eventFormData, setEventFormData] = useState<EventFormData>(
    prefillFormData ?? defaultFormData,
  );

  useDisablePageScroll();

  const createEvent = api.event.create.useMutation({
    onSuccess: () => {
      toggleEventForm();
      router.refresh();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.eventName;
      if (errorMessage?.[0]) window.alert(errorMessage);
      else window.alert("Failed to create event! Please try again later.");
    },
  });

  const updateEvent = api.event.update.useMutation({
    onSuccess: () => {
      toggleEventForm();
      router.refresh();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.eventName;
      if (errorMessage?.[0]) window.alert(errorMessage);
      else window.alert("Failed to update event! Please try again later.");
    },
  });

  const deleteEvent = api.event.delete.useMutation({
    onSuccess: () => {
      toggleEventForm();
      router.refresh();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.eventName;
      if (errorMessage?.[0]) window.alert(errorMessage);
      else window.alert("Failed to delete event! Please try again later.");
    },
  });

  const handleOnChange = ({
    field,
    inputValue,
  }: {
    field: string;
    inputValue: string;
  }) => {
    setEventFormData((prev) => {
      return {
        ...prev,
        [field]: inputValue,
      };
    });
  };

  const handleSaveEvent = () => {
    if (isEditMode) {
      updateEvent.mutate(eventFormData);
    } else {
      createEvent.mutate(eventFormData);
    }
  };

  const isProcessing =
    createEvent.isLoading || updateEvent.isLoading || deleteEvent.isLoading;

  return (
    <div className="fixed top-0 z-10 flex h-screen w-screen justify-end overflow-y-auto bg-transparent/[0.5]">
      {showDeleteConfirmation && (
        <DeleteConfirmation
          isProcessing={isProcessing}
          disclaimerText={
            "Deleting this event will remove it from your website, and also erase any guest lists, RSVPs, and meals associated with it."
          }
          noHandler={() => setShowDeleteConfirmation(false)}
          yesHandler={() =>
            deleteEvent.mutate({ eventId: eventFormData.eventId })
          }
        />
      )}
      <form
        className={`h-full ${sharedStyles.sidebarFormWidth} bg-white`}
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveEvent();
        }}
      >
        <div className="flex justify-between border-b p-5">
          <h1 className="text-xl font-semibold">
            {isEditMode ? "Edit Event" : "Add Event"}
          </h1>
          <IoMdClose
            size={25}
            className="cursor-pointer"
            onClick={() => toggleEventForm()}
          />
        </div>
        <div className="p-5">
          <h2 className="mb-3 text-xl font-semibold">Event Information</h2>
          <div className="grid grid-cols-1 grid-rows-[repeat(6,50px)] gap-5">
            <AnimatedInputLabel
              id="event-name"
              inputValue={eventFormData.eventName}
              fieldName="eventName"
              labelText="Event Name*"
              required={true}
              handleOnChange={handleOnChange}
            />
            <DateInput
              date={eventFormData.date}
              handleOnChange={handleOnChange}
            />
            <TimeSelections
              startTime={eventFormData.startTime}
              endTime={eventFormData.endTime}
              handleOnChange={handleOnChange}
            />
            <AnimatedInputLabel
              id="event-venue"
              inputValue={eventFormData.venue ?? ""}
              fieldName="venue"
              labelText="Venue Name"
              handleOnChange={handleOnChange}
            />
            <AnimatedInputLabel
              id="event-attire"
              inputValue={eventFormData.attire ?? ""}
              fieldName="attire"
              labelText="Attire"
              handleOnChange={handleOnChange}
            />
            <AnimatedInputLabel
              id="event-description"
              inputValue={eventFormData.description ?? ""}
              fieldName="description"
              labelText="Description"
              handleOnChange={handleOnChange}
            />
          </div>
        </div>
        <div
          className="fixed bottom-0 flex flex-col gap-3 border-t px-8 py-5"
          style={{ width: "inherit" }}
        >
          <div className="flex gap-5">
            <button
              disabled={isProcessing}
              onClick={() => toggleEventForm()}
              className={`${sharedStyles.secondaryButton({
                py: "py-2",
                isLoading: isProcessing,
              })} w-1/2 ${
                isProcessing
                  ? "text-pink-200"
                  : `text-${sharedStyles.primaryColor}`
              }`}
            >
              Cancel
            </button>
            <button
              id="save-event"
              type="submit"
              name="save-event"
              disabled={isProcessing}
              className={`w-1/2 ${sharedStyles.primaryButton({
                py: "py-2",
                isLoading: isProcessing,
              })}`}
            >
              {isProcessing ? "Processing..." : "Save & Close"}
            </button>
          </div>
          {isEditMode && (
            <button
              disabled={isProcessing}
              onClick={(e) => {
                e.preventDefault();
                setShowDeleteConfirmation(true);
              }}
              className={`font-semibold ${
                isProcessing ? "cursor-not-allowed" : "hover:underline"
              } ${
                isProcessing
                  ? "text-pink-200"
                  : `text-${sharedStyles.primaryColor}`
              }`}
            >
              Remove Event
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
