import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

type Option = {
  id: string;
  responseCount: number;
  text: string;
  description: string;
  questionId: string;
};

type Question = {
  id: string | undefined;
  eventId?: string | null;
  websiteId?: string | null;
  text: string;
  type: string;
  isRequired: boolean;
  options?: Option[];
};

type Event = {
  id: string;
  name: string;
  date: Date | null;
  startTime: string | null;
  endTime: string | null;
  venue: string | null;
  attire: string | null;
  description: string | null;
  userId: string;
  questions?: Question[];
  collectRsvp?: boolean;
};

interface EventWithResponses extends Event {
  guestResponses: {
    attending: number;
    invited: number;
    declined: number;
    notInvited: number;
  };
}

type Invitation = {
  eventId: string;
  rsvp: string | null;
};

type Household = {
  id: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  gifts: Gift[];
  guests: Guest[];
};

type Gift = {
  eventId: string;
  householdId?: string;
  thankyou: boolean;
  description?: string | null | undefined;
  event?: {
    name: string;
  };
};

type Guest = {
  id: number;
  firstName: string;
  lastName: string;
  isPrimaryContact: boolean;
  userId: string;
  householdId: string;
  invitations?: Invitation[];
};

type User = {
  id: string;
  websiteUrl: string;
  email: string;
  groomFirstName: string;
  groomLastName: string;
  brideFirstName: string;
  brideLastName: string;
};

type WeddingDate = {
  standardFormat: string;
  numberFormat: string;
};

type WeddingData = {
  groomFirstName: string;
  groomLastName: string;
  brideFirstName: string;
  brideLastName: string;
  daysRemaining: number;
  date: WeddingDate;
};

type EventFormData = {
  eventName: string;
  date: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
  venue: string | undefined;
  attire: string | undefined;
  description: string | undefined;
  eventId: string;
};

type EventId = string;
type RSVP = string;
type FormInvites = Record<EventId, RSVP>;

type GuestFormData = {
  guestId?: number;
  firstName: string;
  lastName: string;
  isPrimaryContact?: boolean;
  invites: FormInvites;
};

type HouseholdFormData = {
  householdId: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  notes?: string;
  gifts: Gift[];
  guestParty: GuestFormData[];
};

type Website = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  url: string;
  subUrl: string;
  isPasswordEnabled: boolean;
  isRsvpEnabled: boolean;
  password: string | null;
  generalQuestions?: Question[];
};

type WeddingPageData = {
  groomFirstName: string;
  groomLastName: string;
  brideFirstName: string;
  brideLastName: string;
  date: {
    standardFormat: string;
    numberFormat: string;
  };
  website: Website;
  daysRemaining: number;
  events: Event[];
};

type StepFormProps = {
  goNext?: () => void;
  goBack?: () => void;
};

type RsvpFormResponse = {
  eventId: string;
  guestId: number;
  rsvp: string;
  guestName: string;
};

type Answer = {
  questionId: string;
  guestId: number;
  response: {
    type: string;
    answer?: string;
    selectedOptionId?: string;
  };
};

type formOption = {
  id?: string;
  text: string;
  description: string;
};
type TQuestionOption = Option | formOption;

type RouterOutput = inferRouterOutputs<AppRouter>;
type DashboardData = RouterOutput["dashboard"]["getByUserId"];
type HouseholdSearch = RouterOutput["household"]["findBySearch"];
type RsvpPageData = RouterOutput["website"]["fetchWeddingData"];

export {
  type TQuestionOption,
  type Option,
  type Question,
  type Event,
  type EventWithResponses,
  type Invitation,
  type Household,
  type Gift,
  type Guest,
  type User,
  type WeddingData,
  type EventFormData,
  type GuestFormData,
  type HouseholdFormData,
  type FormInvites,
  type Website,
  type WeddingPageData,
  type DashboardData,
  type StepFormProps,
  type HouseholdSearch,
  type RsvpPageData,
  type RsvpFormResponse,
  type Answer,
};
