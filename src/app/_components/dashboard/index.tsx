"use client";

import { useEffect, useState } from "react";
import { useEventForm } from "../contexts/event-form-context";

import DashboardHeader from "./header";
import RegistrySetup from "./registry-setup";
import PageSectionsTemplate from "./page-section-template";
import RsvpContent from "./section-content/rsvp";
import DashboardControls from "./controls";
import SidebarPanel from "./sidebar-panel";
import HomeContent from "./section-content/home";
import EventForm from "../forms/event-form";
import DashboardSettingsForm from "../forms/dashboard-settings-form";
import RsvpSettingsForm from "../forms/rsvp-settings-form";

import {
  type DashboardData,
  type EventFormData,
} from "~/app/utils/shared-types";

export default function Dashboard({
  dashboardData,
}: {
  dashboardData: DashboardData;
}) {
  console.log("dashz", dashboardData);
  const isEventFormOpen = useEventForm();
  const [showRegistrySetup, setShowRegistrySetup] = useState<boolean>(true);
  const [events, setEvents] = useState(dashboardData?.events);
  const [prefillEvent, setPrefillEvent] = useState<EventFormData | undefined>();
  const [collapseSections, setCollapseSections] = useState<boolean>(false);
  const [showRsvpSettings, setShowRsvpSettings] = useState<boolean>(false);
  const [showWebsiteSettings, setShowWebsiteSettings] =
    useState<boolean>(false);

  useEffect(() => {
    setEvents(dashboardData?.events ?? []);
  }, [dashboardData]);

  useEffect(() => {
    setShowRegistrySetup(
      localStorage.getItem("registrySectionStatus") !== "hidden",
    );
  }, []);

  if (showRsvpSettings) {
    return (
      <RsvpSettingsForm
        dashboardData={dashboardData}
        setShowRsvpSettings={setShowRsvpSettings}
      />
    );
  }
  return (
    <>
      {isEventFormOpen && <EventForm prefillFormData={prefillEvent} />}
      {showWebsiteSettings && (
        <DashboardSettingsForm
          setShowWebsiteSettings={setShowWebsiteSettings}
          website={dashboardData?.weddingData?.website}
        />
      )}
      <DashboardHeader
        websiteUrl={dashboardData?.weddingData?.website?.url}
        setShowWebsiteSettings={setShowWebsiteSettings}
      />
      <hr className="relative -left-48 bottom-0 w-screen border-gray-300" />
      {showRegistrySetup && (
        <RegistrySetup setShowRegistrySetup={setShowRegistrySetup} />
      )}
      <hr className="relative -left-48 bottom-0 w-screen border-gray-300" />
      <div className="mt-14 grid grid-cols-[3fr_275px] gap-7">
        <div>
          <div className="flex justify-between pb-8">
            <h2 className="text-xl font-semibold">Pages</h2>
            <DashboardControls
              collapseSections={collapseSections}
              setCollapseSections={setCollapseSections}
            />
          </div>
          <PageSectionsTemplate title={"Home"} collapse={collapseSections}>
            <HomeContent
              dashboardData={dashboardData}
              events={events}
              setPrefillEvent={setPrefillEvent}
            />
          </PageSectionsTemplate>
          <PageSectionsTemplate
            title={"Our Story"}
            collapse={collapseSections}
          />
          <PageSectionsTemplate
            title={"Wedding Party"}
            collapse={collapseSections}
          />
          <PageSectionsTemplate title={"Photos"} collapse={collapseSections} />
          <PageSectionsTemplate title={"Q + A"} collapse={collapseSections} />
          <PageSectionsTemplate title={"Travel"} collapse={collapseSections} />
          <PageSectionsTemplate
            title={"Things to Do"}
            collapse={collapseSections}
          />
          <PageSectionsTemplate
            title={"RSVP"}
            collapse={collapseSections}
            setShowRsvpSettings={setShowRsvpSettings}
          >
            <RsvpContent
              events={dashboardData?.events}
              totalGuests={dashboardData?.totalGuests ?? 0}
            />
          </PageSectionsTemplate>
        </div>
        <SidebarPanel setShowWebsiteSettings={setShowWebsiteSettings} />
      </div>
    </>
  );
}
