import { useRouter } from "next/navigation";
import { useState } from "react";
import { sharedStyles } from "~/app/utils/shared-styles";
import { api } from "~/trpc/react";
import { useToggleGuestForm } from "../../contexts/guest-form-context";

import { type Event, type HouseholdFormData } from "~/app/utils/shared-types";
import { type Dispatch, type SetStateAction } from "react";

type AddFormButtonsProps = {
  events: Event[];
  householdFormData: HouseholdFormData;
  setHouseholdFormData: Dispatch<SetStateAction<HouseholdFormData>>;
  defaultHouseholdFormData: (events: Event[]) => HouseholdFormData;
};

export default function AddFormButtons({
  events,

  householdFormData,
  setHouseholdFormData,
  defaultHouseholdFormData,
}: AddFormButtonsProps) {
  const router = useRouter();
  const toggleGuestForm = useToggleGuestForm();
  const [closeForm, setCloseForm] = useState<boolean>(false);

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

  return (
    <div
      className="fixed bottom-0 flex flex-col gap-3 border-t bg-white px-3 py-5"
      style={{ width: "inherit" }}
    >
      <div className="flex gap-3 text-sm">
        <button
          disabled={createGuests.isLoading}
          onClick={() => {
            setCloseForm(true);
            createGuests.mutate(householdFormData);
          }}
          className={`w-1/2 ${sharedStyles.secondaryButton({
            py: "py-2",
            isLoading: createGuests.isLoading,
          })}`}
        >
          {createGuests.isLoading ? "Processing..." : "Save & Close"}
        </button>
        <button
          disabled={createGuests.isLoading}
          className={`w-1/2 ${sharedStyles.primaryButton({
            px: "px-2",
            py: "py-2",
            isLoading: createGuests.isLoading,
          })}`}
          onClick={() => {
            setCloseForm(false);
            createGuests.mutate(householdFormData);
          }}
        >
          {createGuests.isLoading
            ? "Processing..."
            : "Save & Add Another Guest"}
        </button>
      </div>
      <button
        onClick={() => toggleGuestForm()}
        className={`text-sm font-semibold ${
          createGuests.isLoading ? "cursor-not-allowed" : "hover:underline"
        } ${
          createGuests.isLoading
            ? "text-pink-200"
            : `text-${sharedStyles.primaryColor}`
        }`}
      >
        Cancel
      </button>
    </div>
  );
}
