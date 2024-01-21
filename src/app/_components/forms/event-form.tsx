"use client";

import { useState } from "react";
import { api } from "~/trpc/server";
import { sharedStyles } from "../../utils/shared-styles";
import { useToggleEventForm } from "../contexts/event-form-context";
import { IoMdClose } from "react-icons/io";
import { useDisablePageScroll } from "../hooks";
import DeleteConfirmation from "./delete-confirmation";

import { type Dispatch, type SetStateAction } from "react";
import { type EventFormData, type Event } from "../../utils/shared-types";

type EventFormProps = {
  setEvents: Dispatch<SetStateAction<Event[] | undefined>>;
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

export default function EventForm({
  setEvents,
  prefillFormData,
}: EventFormProps) {
  const isEditMode = !!prefillFormData;
  const toggleEventForm = useToggleEventForm();

  const { mutate: createEvent, isLoading: isCreatingEvent } =
    api.event.create.useMutation({
      onSuccess: (createdEvent) => {
        toggleEventForm();
        setEvents((prevEvents) =>
          prevEvents ? [...prevEvents, createdEvent] : [createdEvent],
        );
      },
      onError: (err) => {
        const errorMessage = err.data?.zodError?.fieldErrors?.eventName;
        if (errorMessage?.[0]) window.alert(errorMessage);
        else window.alert("Failed to create event! Please try again later.");
      },
    });

  const { mutate: updateEvent, isLoading: isUpdatingEvent } =
    api.event.update.useMutation({
      onSuccess: (updatedEvent) => {
        toggleEventForm();
        setEvents((prevEvents) => {
          if (!prevEvents) return [updatedEvent];
          return prevEvents.map((prev) =>
            prev.id === updatedEvent.id ? updatedEvent : prev,
          );
        });
      },
      onError: (err) => {
        const errorMessage = err.data?.zodError?.fieldErrors?.eventName;
        if (errorMessage?.[0]) window.alert(errorMessage);
        else window.alert("Failed to update event! Please try again later.");
      },
    });

  const { mutate: deleteEvent, isLoading: isDeletingEvent } =
    api.event.delete.useMutation({
      onSuccess: (deletedEventId) => {
        toggleEventForm();
        setEvents((prevEvents) =>
          prevEvents?.filter((event) => event.id !== deletedEventId),
        );
      },
      onError: (err) => {
        const errorMessage = err.data?.zodError?.fieldErrors?.eventName;
        if (errorMessage?.[0]) window.alert(errorMessage);
        else window.alert("Failed to delete event! Please try again later.");
      },
    });

  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [eventFormData, setEventFormData] = useState<EventFormData>(
    prefillFormData ?? defaultFormData,
  );

  useDisablePageScroll();

  const handleOnChange = (field: string, input: string) => {
    setEventFormData((prev) => {
      return {
        ...prev,
        [field]: input,
      };
    });
  };

  const handleSaveEvent = () => {
    if (isEditMode) {
      updateEvent(eventFormData);
    } else {
      createEvent(eventFormData);
    }
  };

  const isProcessing = isCreatingEvent || isUpdatingEvent || isDeletingEvent;

  return (
    <div className="fixed top-0 z-10 flex h-screen w-screen justify-end overflow-y-auto bg-transparent/[0.5]">
      {showDeleteConfirmation && (
        <DeleteConfirmation
          isProcessing={isProcessing}
          disclaimerText={
            "Deleting this event will remove it from your website, and also erase any guest lists, RSVPs, and meals associated with it."
          }
          noHandler={() => setShowDeleteConfirmation(false)}
          yesHandler={() => deleteEvent({ eventId: eventFormData.eventId })}
        />
      )}
      <div className={`h-full ${sharedStyles.sidebarFormWidth} bg-white`}>
        <div className="flex justify-between border-b p-5">
          <h1 className="text-xl font-semibold">
            {isEditMode ? "Edit Event" : "Add Event"}
          </h1>
          <span className="cursor-pointer" onClick={() => toggleEventForm()}>
            <IoMdClose size={25} />
          </span>
        </div>
        <div className="p-5">
          <h2 className="mb-3 text-xl font-semibold">Event Information</h2>
          <div className="grid grid-cols-1 grid-rows-[repeat(6,50px)] gap-3">
            <input
              placeholder="Event Name*"
              value={eventFormData.eventName ?? ""}
              onChange={(e) => handleOnChange("eventName", e.target.value)}
              className="w-100 border p-3"
            />

            <input
              placeholder="MM/DD/YYYY"
              value={eventFormData.date ?? ""}
              onChange={(e) => handleOnChange("date", e.target.value)}
              className="w-100 border p-3"
            />
            <div className="flex gap-3">
              <select
                value={eventFormData.startTime ?? ""}
                onChange={(e) => handleOnChange("startTime", e.target.value)}
                className="w-1/2 border p-3"
              >
                <option defaultValue="Start Time">Start Time</option>
                <option>12:00 PM</option>
                <option>12:15 PM</option>
                <option>12:30 PM</option>
              </select>
              <select
                value={eventFormData.endTime ?? ""}
                onChange={(e) => handleOnChange("endTime", e.target.value)}
                className="w-1/2 border p-3"
              >
                <option defaultValue="End Time">End Time</option>
                <option>12:00 PM</option>
                <option>12:15 PM</option>
                <option>12:30 PM</option>
              </select>
            </div>
            <input
              placeholder="Venue Name"
              value={eventFormData.venue ?? ""}
              onChange={(e) => handleOnChange("venue", e.target.value)}
              className="w-100 border p-3"
            />
            <input
              placeholder="Attire"
              value={eventFormData.attire ?? ""}
              onChange={(e) => handleOnChange("attire", e.target.value)}
              className="w-100 border p-3"
            />
            <input
              placeholder="Description"
              value={eventFormData.description ?? ""}
              onChange={(e) => handleOnChange("description", e.target.value)}
              className="w-100 border p-3"
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
              disabled={isProcessing}
              className={`w-1/2 ${sharedStyles.primaryButton({
                py: "py-2",
                isLoading: isProcessing,
              })}`}
              onClick={() => handleSaveEvent()}
            >
              {isProcessing ? "Processing..." : "Save & Close"}
            </button>
          </div>
          {isEditMode && (
            <button
              disabled={isProcessing}
              onClick={() => setShowDeleteConfirmation(true)}
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
      </div>
    </div>
  );
}
