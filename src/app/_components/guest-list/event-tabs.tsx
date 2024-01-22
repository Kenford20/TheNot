import Link from "next/link";
import { useToggleEventForm } from "../contexts/event-form-context";
import { sharedStyles } from "~/app/utils/shared-styles";

import { type Event } from "~/app/utils/shared-types";

type EventsTabsProps = {
  events: Event[];
  selectedEventId: string;
};

export default function EventsTabs({
  events,
  selectedEventId,
}: EventsTabsProps) {
  const toggleEventForm = useToggleEventForm();

  return (
    <div className="border-b">
      <ul className={`flex gap-5 ${sharedStyles.desktopPaddingSidesGuestList}`}>
        <li
          className={`cursor-pointer border-b-4 py-3 text-sm hover:border-gray-600 ${
            selectedEventId === "all" ? "border-gray-600" : "border-transparent"
          }`}
        >
          <Link href="?event=all" scroll={false}>
            All Events
          </Link>
        </li>
        {events?.map((event) => {
          return (
            <li
              className={`cursor-pointer border-b-4 py-3 text-sm hover:border-gray-600 ${
                selectedEventId === event.id
                  ? "border-gray-600"
                  : "border-transparent"
              }`}
              key={event.id}
            >
              <Link href={`?event=${event.id}`} scroll={false}>
                {event.name}
              </Link>
            </li>
          );
        })}
        <button
          className={`pb-1 text-sm font-semibold text-${sharedStyles.primaryColor}`}
          onClick={() => toggleEventForm()}
        >
          + New Event
        </button>
      </ul>
    </div>
  );
}
