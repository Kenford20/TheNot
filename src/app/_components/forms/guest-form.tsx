"use client";

import { useState } from "react";
import { api } from "~/trpc/server";
import { sharedStyles } from "../../utils/shared-styles";
import { useToggleGuestForm } from "../contexts/guest-form-context";
import { useDisablePageScroll } from "../hooks";
import { GuestNameForm } from "./guest-names";
import { IoMdClose } from "react-icons/io";
import DeleteConfirmation from "./delete-confirmation";

import { type Dispatch, type SetStateAction } from "react";
import {
  type FormInvites,
  type Event,
  type Household,
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
  phoneNumber: undefined,
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
  setHouseholds: Dispatch<SetStateAction<Household[] | undefined>>;
  prefillFormData: HouseholdFormData | undefined;
};

export default function GuestForm({
  events,
  setHouseholds,
  prefillFormData,
}: GuestFormProps) {
  const isEditMode = !!prefillFormData;
  const toggleGuestForm = useToggleGuestForm();

  const { mutate: deleteHousehold, isLoading: isDeletingHousehold } =
    api.household.delete.useMutation({
      onSuccess: (deletedHouseholdId) => {
        toggleGuestForm();
        setHouseholds((prevHouseholds) =>
          prevHouseholds?.filter(
            (household) => household.id !== deletedHouseholdId,
          ),
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
  const [householdFormData, setHouseholdFormData] = useState<HouseholdFormData>(
    prefillFormData ?? defaultHouseholdFormData(events),
  );
  const [deletedGuests, setDeletedGuests] = useState<number[]>([]);

  useDisablePageScroll();

  const getTitle = () => {
    if (!isEditMode || !prefillFormData) return "Add Party";
    const primaryContact = prefillFormData.guestParty.find(
      (guest) => guest.isPrimaryContact,
    );
    const primaryContactName =
      primaryContact?.firstName + " " + primaryContact?.lastName;
    const numGuests = prefillFormData.guestParty.length;
    return numGuests > 1
      ? `${primaryContactName} + ${numGuests - 1}`
      : primaryContactName;
  };

  const handleOnChange = (field: string, input: string) => {
    setHouseholdFormData((prev) => {
      return {
        ...prev,
        [field]: input,
      };
    });
    console.log(householdFormData);
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

  return (
    <div className="fixed top-0 z-50 flex h-screen w-screen justify-end overflow-y-scroll bg-transparent/[0.5] pb-24">
      {showDeleteConfirmation && (
        <DeleteConfirmation
          isProcessing={isDeletingHousehold}
          disclaimerText={
            "Please confirm whether you would like to delete this party along with all its guests."
          }
          noHandler={() => setShowDeleteConfirmation(false)}
          yesHandler={() =>
            deleteHousehold({ householdId: householdFormData.householdId })
          }
        />
      )}
      <div
        className={`relative h-fit ${sharedStyles.sidebarFormWidth} bg-white`}
      >
        <div className="flex justify-between border-b p-5">
          <h1 className="text-2xl font-bold">{getTitle()}</h1>
          <span className="cursor-pointer" onClick={() => toggleGuestForm()}>
            <IoMdClose size={25} />
          </span>
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
          <div className="grid grid-cols-1 grid-rows-[repeat(5,50px)] gap-3">
            <input
              className="w-100 border p-3"
              placeholder="Street Address"
              value={householdFormData.address1}
              onChange={(e) => handleOnChange("address1", e.target.value)}
            />
            <input
              className="w-100 border p-3"
              placeholder="Apt/Suite/Other"
              value={householdFormData.address2}
              onChange={(e) => handleOnChange("address2", e.target.value)}
            />
            <div className="flex gap-3">
              <input
                className="w-1/2 border p-3"
                placeholder="City"
                value={householdFormData.city}
                onChange={(e) => handleOnChange("city", e.target.value)}
              />
              <select
                value={householdFormData.state}
                onChange={(e) => handleOnChange("state", e.target.value)}
                className="w-1/4 border p-3"
              >
                <option defaultValue="State">State</option>
                <option>AL</option>
                <option>AR</option>
                <option>WY</option>
              </select>
              <input
                className="w-1/4 border p-3"
                placeholder="Zip Code"
                value={householdFormData.zipCode}
                onChange={(e) => handleOnChange("zipCode", e.target.value)}
              />
            </div>
            <select
              className="w-100 border p-3"
              value={householdFormData.country}
              onChange={(e) => handleOnChange("country", e.target.value)}
            >
              <option defaultValue="State">Country</option>
              <option>Murca</option>
              <option>Mexico</option>
              <option>Canada</option>
            </select>
            <div className="flex gap-3">
              <input
                type="tel"
                className="w-1/2 border p-3"
                placeholder="Phone"
                value={householdFormData.phone}
                onChange={(e) => handleOnChange("phone", e.target.value)}
              />
              <input
                type="email"
                className="w-1/2 border p-3"
                placeholder="Email"
                value={householdFormData.email}
                onChange={(e) => handleOnChange("email", e.target.value)}
              />
            </div>
          </div>
          <h2 className="my-4 text-2xl font-bold">My Notes</h2>
          <textarea
            placeholder="Enter notes about your guests, like food allergies"
            value={householdFormData.notes}
            onChange={(e) => handleOnChange("notes", e.target.value)}
            className="h-32 w-full border p-3"
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
            events={events}
            householdFormData={householdFormData}
            deletedGuests={deletedGuests}
            setHouseholds={setHouseholds}
            setHouseholdFormData={setHouseholdFormData}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
          />
        ) : (
          <AddFormButtons
            events={events}
            householdFormData={householdFormData}
            setHouseholds={setHouseholds}
            setHouseholdFormData={setHouseholdFormData}
          />
        )}
      </div>
    </div>
  );
}

type GiftSectionProps = {
  setHouseholdFormData: Dispatch<SetStateAction<HouseholdFormData>>;
  householdFormData: HouseholdFormData;
};

const GiftSection = ({
  householdFormData,
  setHouseholdFormData,
}: GiftSectionProps) => {
  const handleOnChange = (
    key: string,
    value: boolean | string,
    updatedEvent: string,
  ) => {
    setHouseholdFormData((prev) => {
      return {
        ...prev,
        gifts: prev.gifts?.map((gift) => {
          if (gift.eventId === updatedEvent) {
            return {
              ...gift,
              [key]: value,
            };
          }
          return gift;
        }),
      };
    });
  };

  return (
    <>
      <h2 className="my-4 text-2xl font-bold">Gifts</h2>
      {householdFormData.gifts?.map((gift) => {
        return (
          <div key={gift.eventId} className="mb-6">
            <h3 className="mb-3 text-lg font-semibold">{gift.event?.name}</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <input
                  className="h-6 w-6 cursor-pointer border p-3"
                  style={{ accentColor: sharedStyles.primaryColorHex }}
                  type="checkbox"
                  id={`thank-you-event: ${gift.eventId}`}
                  onChange={(e) =>
                    handleOnChange("thankyou", e.target.checked, gift.eventId)
                  }
                  checked={gift.thankyou}
                />
                <label
                  className={`cursor-pointer ${sharedStyles.ellipsisOverflow}`}
                  htmlFor={`thank-you-event: ${gift.eventId}`}
                >
                  Thank You Sent
                </label>
              </div>
              <input
                placeholder="Gift Received"
                className="w-[100%] border p-3"
                value={gift.description ?? ""}
                onChange={(e) =>
                  handleOnChange("description", e.target.value, gift.eventId)
                }
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

type AddFormButtonsProps = {
  events: Event[];
  householdFormData: HouseholdFormData;
  setHouseholds: Dispatch<SetStateAction<Household[] | undefined>>;
  setHouseholdFormData: Dispatch<SetStateAction<HouseholdFormData>>;
};

const AddFormButtons = ({
  events,
  householdFormData,
  setHouseholds,
  setHouseholdFormData,
}: AddFormButtonsProps) => {
  const toggleGuestForm = useToggleGuestForm();
  const [closeForm, setCloseForm] = useState<boolean>(false);

  const { mutate: createGuests, isLoading: isCreatingGuests } =
    api.household.create.useMutation({
      onSuccess: (createdHousehold) => {
        console.log("newz", createdHousehold);
        closeForm && toggleGuestForm();
        setHouseholdFormData(defaultHouseholdFormData(events));
        setHouseholds((prevHouseholds: Household[] | undefined) =>
          prevHouseholds
            ? [...prevHouseholds, createdHousehold]
            : [createdHousehold],
        );
      },
      onError: (err) => {
        const errorMessage = err.data?.zodError?.fieldErrors?.guestParty;
        if (errorMessage?.[0])
          window.alert("Please fill in the full name for all guests!");
        else window.alert("Failed to create guests! Please try again later.");
      },
    });

  return (
    <div
      className="fixed bottom-0 flex flex-col gap-3 border-t bg-white px-3 py-5"
      style={{ width: "inherit" }}
    >
      <div className="flex gap-3 text-sm">
        <button
          disabled={isCreatingGuests}
          onClick={() => {
            setCloseForm(true);
            createGuests(householdFormData);
          }}
          className={`w-1/2 ${sharedStyles.secondaryButton({
            py: "py-2",
            isLoading: isCreatingGuests,
          })}`}
        >
          {isCreatingGuests ? "Processing..." : "Save & Close"}
        </button>
        <button
          disabled={isCreatingGuests}
          className={`w-1/2 ${sharedStyles.primaryButton({
            px: "px-2",
            py: "py-2",
            isLoading: isCreatingGuests,
          })}`}
          onClick={() => {
            setCloseForm(false);
            createGuests(householdFormData);
          }}
        >
          {isCreatingGuests ? "Processing..." : "Save & Add Another Guest"}
        </button>
      </div>
      <button
        onClick={() => toggleGuestForm()}
        className={`text-sm font-semibold ${
          isCreatingGuests ? "cursor-not-allowed" : "hover:underline"
        } ${
          isCreatingGuests
            ? "text-pink-200"
            : `text-${sharedStyles.primaryColor}`
        }`}
      >
        Cancel
      </button>
    </div>
  );
};

type EditFormButtonsProps = {
  events: Event[];
  householdFormData: HouseholdFormData;
  deletedGuests: number[];
  setHouseholds: Dispatch<SetStateAction<Household[] | undefined>>;
  setHouseholdFormData: Dispatch<SetStateAction<HouseholdFormData>>;
  setShowDeleteConfirmation: Dispatch<SetStateAction<boolean>>;
};

const EditFormButtons = ({
  events,
  householdFormData,
  deletedGuests,
  setHouseholds,
  setHouseholdFormData,
  setShowDeleteConfirmation,
}: EditFormButtonsProps) => {
  const toggleGuestForm = useToggleGuestForm();

  const { mutate: updateHousehold, isLoading: isUpdatingHousehold } =
    api.household.update.useMutation({
      onSuccess: (updatedHousehold) => {
        toggleGuestForm();
        setHouseholdFormData(defaultHouseholdFormData(events));
        setHouseholds((prevHouseholds: Household[] | undefined) => {
          if (!prevHouseholds) return [updatedHousehold];
          return prevHouseholds.map((prev) =>
            prev.id === updatedHousehold.id ? updatedHousehold : prev,
          );
        });
      },
      onError: (err) => {
        const errorMessage = err.data?.zodError?.fieldErrors?.guestParty;
        if (errorMessage?.[0])
          window.alert("Please fill in the full name for all guests!");
        else window.alert("Failed to update party! Please try again later.");
      },
    });

  return (
    <div
      className="fixed bottom-0 flex flex-col gap-3 border-t bg-white px-3 py-5"
      style={{ width: "inherit" }}
    >
      <div className="flex gap-3 text-sm">
        <button
          disabled={isUpdatingHousehold}
          onClick={() => toggleGuestForm()}
          className={`w-1/2 ${sharedStyles.secondaryButton({
            py: "py-2",
            isLoading: isUpdatingHousehold,
          })}`}
        >
          Cancel
        </button>
        <button
          disabled={isUpdatingHousehold}
          className={`w-1/2 ${sharedStyles.primaryButton({
            px: "px-2",
            py: "py-2",
            isLoading: isUpdatingHousehold,
          })}`}
          onClick={() =>
            updateHousehold({ ...householdFormData, deletedGuests })
          }
        >
          {isUpdatingHousehold ? "Processing..." : "Save"}
        </button>
      </div>
      <button
        onClick={() => setShowDeleteConfirmation(true)}
        className={`text-sm font-bold ${
          isUpdatingHousehold ? "cursor-not-allowed" : "hover:underline"
        } ${
          isUpdatingHousehold
            ? "text-pink-200"
            : `text-${sharedStyles.primaryColor}`
        }`}
      >
        {isUpdatingHousehold ? "Processing..." : "Delete Party"}
      </button>
    </div>
  );
};
