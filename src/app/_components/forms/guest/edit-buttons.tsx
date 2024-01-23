import { useRouter } from "next/navigation";
import { sharedStyles } from "~/app/utils/shared-styles";
import { api } from "~/trpc/react";
import { useToggleGuestForm } from "../../contexts/guest-form-context";

import { type Event, type HouseholdFormData } from "~/app/utils/shared-types";
import { type Dispatch, type SetStateAction } from "react";

type EditFormButtonsProps = {
  events: Event[];
  householdFormData: HouseholdFormData;
  deletedGuests: number[];
  setHouseholdFormData: Dispatch<SetStateAction<HouseholdFormData>>;
  setShowDeleteConfirmation: Dispatch<SetStateAction<boolean>>;
  defaultHouseholdFormData: (events: Event[]) => HouseholdFormData;
};

export default function EditFormButtons({
  events,
  householdFormData,
  deletedGuests,
  setHouseholdFormData,
  setShowDeleteConfirmation,
  defaultHouseholdFormData,
}: EditFormButtonsProps) {
  const router = useRouter();
  const toggleGuestForm = useToggleGuestForm();

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

  return (
    <div
      className="fixed bottom-0 z-20 flex flex-col gap-3 border-t bg-white px-3 py-5"
      style={{ width: "inherit" }}
    >
      <div className="flex gap-3 text-sm">
        <button
          disabled={updateHousehold.isLoading}
          onClick={() => toggleGuestForm()}
          className={`w-1/2 ${sharedStyles.secondaryButton({
            py: "py-2",
            isLoading: updateHousehold.isLoading,
          })}`}
        >
          Cancel
        </button>
        <button
          disabled={updateHousehold.isLoading}
          className={`w-1/2 ${sharedStyles.primaryButton({
            px: "px-2",
            py: "py-2",
            isLoading: updateHousehold.isLoading,
          })}`}
          onClick={() =>
            updateHousehold.mutate({ ...householdFormData, deletedGuests })
          }
        >
          {updateHousehold.isLoading ? "Processing..." : "Save"}
        </button>
      </div>
      <button
        onClick={() => setShowDeleteConfirmation(true)}
        className={`text-sm font-bold ${
          updateHousehold.isLoading ? "cursor-not-allowed" : "hover:underline"
        } ${
          updateHousehold.isLoading
            ? "text-pink-200"
            : `text-${sharedStyles.primaryColor}`
        }`}
      >
        {updateHousehold.isLoading ? "Processing..." : "Delete Party"}
      </button>
    </div>
  );
}
