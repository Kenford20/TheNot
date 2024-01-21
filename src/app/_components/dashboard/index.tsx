"use client";

import { useEffect, useState } from "react";
import { sharedStyles } from "../../utils/shared-styles";
import { useEventForm } from "../contexts/event-form-context";

import DashboardHeader from "./header";
import RegistrySetup from "./registry-setup";
import PageSectionsTemplate from "./page-section-template";
import RsvpContent from "./section-content/rsvp";
import DashboardControls from "./controls";
import SidebarPanel from "./sidebar-panel";
import HomeContent from "./section-content/home";
import EventForm from "../forms/event-form";
import WebsiteSettingsForm from "../forms/website-settings";

import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import { type EventFormData } from "~/app/utils/shared-types";

type RouterOutput = inferRouterOutputs<AppRouter>;

export default function Dashboard({
  dashboardData,
}: {
  dashboardData: RouterOutput["dashboard"]["getByUserId"];
}) {
  console.log("dashz", dashboardData);
  const isEventFormOpen = useEventForm();
  const [showRegistrySetup, setShowRegistrySetup] = useState<boolean>(true);
  const [events, setEvents] = useState(dashboardData?.events);
  const [prefillEvent, setPrefillEvent] = useState<EventFormData | undefined>();
  const [collapseSections, setCollapseSections] = useState<boolean>(false);
  const [isWebsiteSettingsOpen, setIsWebsiteSettingsOpen] =
    useState<boolean>(false);

  useEffect(() => {
    setEvents(dashboardData?.events ?? []);
  }, [dashboardData]);

  useEffect(() => {
    setShowRegistrySetup(
      localStorage.getItem("registrySectionStatus") !== "hidden",
    );
  }, []);

  return (
    <>
      {/* TODO: need to refactor form components that interface with trpc endpoints and think about server/client component relations */}
      {/* {isEventFormOpen && (
        <EventForm setEvents={setEvents} prefillFormData={prefillEvent} />
      )} */}
      {/* {isWebsiteSettingsOpen && (
        <WebsiteSettingsForm
          setIsWebsiteSettingsOpen={setIsWebsiteSettingsOpen}
          website={dashboardData?.weddingData?.website}
        />
      )} */}
      <DashboardHeader
        websiteUrl={dashboardData?.weddingData?.website?.url}
        setIsWebsiteSettingsOpen={setIsWebsiteSettingsOpen}
      />
      {showRegistrySetup && (
        <RegistrySetup setShowRegistrySetup={setShowRegistrySetup} />
      )}
      <div
        className={`mt-14 grid grid-cols-[3.25fr_300px] gap-7 ${sharedStyles.desktopPaddingSides}`}
      >
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
          <PageSectionsTemplate title={"RSVP"} collapse={collapseSections}>
            <RsvpContent
              events={dashboardData?.events}
              totalGuests={dashboardData?.totalGuests}
            />
          </PageSectionsTemplate>
        </div>
        <SidebarPanel setIsWebsiteSettingsOpen={setIsWebsiteSettingsOpen} />
      </div>
    </>
  );
}
