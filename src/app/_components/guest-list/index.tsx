"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGuestForm } from "../contexts/guest-form-context";
import { useEventForm } from "../contexts/event-form-context";

import GuestForm from "../forms/guest-form";
import EventForm from "../forms/event-form";
import GuestHeader from "./header";
import EventsTabs from "./event-tabs";
import NoGuestsView from "./no-guests-view";
import GuestsView from "./guests-view";
import SomethingWentWrongPage from "../500";

import {
  type DashboardData,
  type EventFormData,
  type HouseholdFormData,
} from "../../utils/shared-types";

export default function GuestList({
  dashboardData,
}: {
  dashboardData: DashboardData;
}) {
  const isEventFormOpen = useEventForm();
  const isGuestFormOpen = useGuestForm();
  const searchParams = useSearchParams();
  const selectedEventId = searchParams.get("event") ?? "all";

  const [prefillEvent, setPrefillEvent] = useState<EventFormData | undefined>();
  const [prefillHousehold, setPrefillHousehold] = useState<
    HouseholdFormData | undefined
  >();

  const filteredHouseholdsByEvent = useMemo(
    () =>
      selectedEventId === "all"
        ? dashboardData?.households ?? []
        : dashboardData?.households?.map((household) => {
            return {
              ...household,
              guests: household.guests.filter((guest) => {
                if (!guest.invitations) return false;
                const matchingInvitation = guest.invitations.find(
                  (guest) => guest.eventId === selectedEventId,
                );
                if (matchingInvitation === undefined) return false;
                return matchingInvitation?.rsvp !== "Not Invited";
              }),
            };
          }) ?? [],
    [selectedEventId, dashboardData?.households],
  );

  const totalGuests =
    useMemo(
      () =>
        filteredHouseholdsByEvent?.reduce(
          (acc, household) => acc + household.guests.length,
          0,
        ),
      [filteredHouseholdsByEvent],
    ) ?? 0;

  if (dashboardData === null) return <SomethingWentWrongPage />;

  return (
    <>
      {isGuestFormOpen && (
        <GuestForm
          events={dashboardData?.events}
          prefillFormData={prefillHousehold}
        />
      )}
      {isEventFormOpen && <EventForm prefillFormData={prefillEvent} />}
      {/* <GuestHeader /> */}
      <EventsTabs
        events={dashboardData?.events}
        selectedEventId={selectedEventId}
      />
      {totalGuests > 0 ? (
        <GuestsView
          events={dashboardData.events}
          households={filteredHouseholdsByEvent}
          selectedEventId={selectedEventId}
          setPrefillHousehold={setPrefillHousehold}
          setPrefillEvent={setPrefillEvent}
        />
      ) : (
        <NoGuestsView setPrefillHousehold={setPrefillHousehold} />
      )}
    </>
  );
}
