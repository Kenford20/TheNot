"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToggleGuestForm } from "../contexts/guest-form-context";
import { useDisablePageScroll } from "../hooks";
import { sharedStyles } from "../../utils/shared-styles";
import { api } from "~/trpc/react";
import { IoMdClose } from "react-icons/io";
import { GuestNameForm } from "./guest-names";
import DeleteConfirmation from "./delete-confirmation";
import ContactForm from "./guest/contact-form";
import GiftSection from "./guest/gift-section";
import AddFormButtons from "./guest/add-buttons";
import EditFormButtons from "./guest/edit-buttons";

import { type SyntheticEvent } from "react";
import {
  type FormInvites,
  type Event,
  type HouseholdFormData,
  type Gift,
} from "../../utils/shared-types";

const defaultContactData = {
  address1: undefined,
  address2: undefined,
  city: undefined,
  state: undefined,
  country: undefined,
  zipCode: undefined,
  phone: undefined,
  email: undefined,
  notes: undefined,
};

const defaultHouseholdFormData = (events: Event[]) => {
  const invites: FormInvites = {};
  const gifts: Gift[] = [];
  events.forEach((event: Event) => {
    invites[event.id] = "Not Invited";
    gifts.push({
      eventId: event.id,
      thankyou: false,
      description: undefined,
    });
  });
  return {
    ...defaultContactData,
    householdId: "",
    guestParty: [
      {
        firstName: "",
        lastName: "",
        invites,
      },
    ],
    gifts,
  };
};

type GuestFormProps = {
  events: Event[];
  prefillFormData: HouseholdFormData | undefined;
};

export default function GuestForm({ events, prefillFormData }: GuestFormProps) {
  useDisablePageScroll();
  const toggleGuestForm = useToggleGuestForm();
  const router = useRouter();
  const [closeForm, setCloseForm] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [householdFormData, setHouseholdFormData] = useState<HouseholdFormData>(
    prefillFormData ?? defaultHouseholdFormData(events),
  );
  const [deletedGuests, setDeletedGuests] = useState<number[]>([]);
  const isEditMode = !!prefillFormData;

  const createGuests = api.household.create.useMutation({
    onSuccess: () => {
      closeForm && toggleGuestForm();
      setHouseholdFormData(defaultHouseholdFormData(events));
      router.refresh();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.guestParty;
      if (errorMessage?.[0])
        window.alert("Please fill in the full name for all guests!");
      else window.alert("Failed to create guests! Please try again later.");
    },
  });

  const updateHousehold = api.household.update.useMutation({
    onSuccess: () => {
      toggleGuestForm();
      setHouseholdFormData(defaultHouseholdFormData(events));
      router.refresh();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.guestParty;
      if (errorMessage?.[0])
        window.alert("Please fill in the full name for all guests!");
      else window.alert("Failed to update party! Please try again later.");
    },
  });

  const deleteHousehold = api.household.delete.useMutation({
    onSuccess: () => {
      toggleGuestForm();
      router.refresh();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors?.eventName;
      if (errorMessage?.[0]) window.alert(errorMessage);
      else window.alert("Failed to delete event! Please try again later.");
    },
  });

  const getTitle = () => {
    if (!isEditMode || !prefillFormData) return "Add Party";
    const primaryContact = prefillFormData.guestParty.find(
      (guest) => guest.isPrimaryContact,
    );
    const numGuests = prefillFormData.guestParty.length;
    const primaryContactName =
      primaryContact?.firstName + " " + primaryContact?.lastName;

    return numGuests > 1
      ? `${primaryContactName} + ${numGuests - 1}`
      : primaryContactName;
  };

  const handleOnChange = ({
    field,
    inputValue,
  }: {
    field: string;
    inputValue: string;
  }) => {
    setHouseholdFormData((prev) => {
      return {
        ...prev,
        [field]: inputValue,
      };
    });
  };

  const handleAddGuestToParty = () => {
    const invites: FormInvites = {};
    events.forEach((event: Event) => (invites[event.id] = "Not Invited"));
    setHouseholdFormData((prev) => {
      return {
        ...prev,
        guestParty: [
          ...prev.guestParty,
          {
            firstName: "",
            lastName: "",
            invites,
          },
        ],
      };
    });
  };

  const handleOnSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    interface SubmitEvent extends Event {
      submitter: HTMLButtonElement;
    }
    const submitButton = (e.nativeEvent as unknown as SubmitEvent).submitter;

    if (submitButton.name === "add-button") {
      createGuests.mutate(householdFormData);
    } else {
      updateHousehold.mutate({ ...householdFormData, deletedGuests });
    }
  };

  return (
    <div className="fixed top-0 z-50 flex h-screen w-screen justify-end overflow-y-scroll bg-transparent/[0.5] pb-24">
      {showDeleteConfirmation && (
        <DeleteConfirmation
          isProcessing={deleteHousehold.isLoading}
          disclaimerText={
            "Please confirm whether you would like to delete this party along with all its guests."
          }
          noHandler={() => setShowDeleteConfirmation(false)}
          yesHandler={() =>
            deleteHousehold.mutate({
              householdId: householdFormData.householdId,
            })
          }
        />
      )}
      <form
        className={`relative h-fit ${sharedStyles.sidebarFormWidth} bg-white`}
        onSubmit={(e) => handleOnSubmit(e)}
      >
        <div className="flex justify-between border-b p-5">
          <h1 className="text-2xl font-bold">{getTitle()}</h1>
          <IoMdClose
            size={25}
            className="cursor-pointer"
            onClick={() => toggleGuestForm()}
          />
        </div>
        {householdFormData?.guestParty.map((guest, i) => {
          return (
            <GuestNameForm
              key={i}
              events={events}
              guestIndex={i}
              guest={guest}
              setHouseholdFormData={setHouseholdFormData}
              setDeletedGuests={setDeletedGuests}
            />
          );
        })}
        <div className="mt-3 text-center">
          <button
            onClick={() => handleAddGuestToParty()}
            className={`text-${sharedStyles.primaryColor}`}
          >
            + Add A Guest To This Party
          </button>
        </div>
        <div className="p-5">
          <h2 className="mb-3 text-2xl font-bold">Contact Information</h2>
          <ContactForm
            householdFormData={householdFormData}
            handleOnChange={handleOnChange}
          />
          <h2 className="my-4 text-2xl font-bold">My Notes</h2>
          <textarea
            placeholder="Enter notes about your guests, like food allergies"
            value={householdFormData.notes}
            onChange={(e) =>
              handleOnChange({ field: "notes", inputValue: e.target.value })
            }
            className="h-32 w-full rounded-lg border p-3"
            style={{ resize: "none" }}
          />
          {isEditMode && (
            <GiftSection
              setHouseholdFormData={setHouseholdFormData}
              householdFormData={householdFormData}
            />
          )}
        </div>
        {isEditMode ? (
          <EditFormButtons
            isUpdatingHousehold={updateHousehold.isLoading}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
          />
        ) : (
          <AddFormButtons
            isCreatingGuests={createGuests.isLoading}
            setCloseForm={setCloseForm}
          />
        )}
      </form>
    </div>
  );
}
