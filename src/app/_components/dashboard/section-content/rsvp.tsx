import Link from "next/link";
import { Doughnut } from "react-chartjs-2";
import { MdPeopleOutline } from "react-icons/md";

import { type Question, type Event } from "../../../utils/shared-types";

import "chart.js/auto";

const chartOptions = {
  maintainAspectRatio: true,
  responsive: true,
  cutout: 64,
  plugins: {
    legend: {
      display: false,
    },
  },
};

type GuestResponses = {
  attending: number;
  declined: number;
  invited: number;
  notInvited: number;
};

interface EventWithGuestResponses extends Event {
  guestResponses: GuestResponses;
}

type RsvpContentProps = {
  events: EventWithGuestResponses[] | undefined;
  totalGuests: number;
  generalQuestions: Question[];
};

export default function RsvpContent({
  events,
  totalGuests,
  generalQuestions,
}: RsvpContentProps) {
  return (
    <div className="border-t">
      {events?.map((event) => {
        const numInvitedGuests = totalGuests - event.guestResponses.notInvited;
        return (
          <div key={event.id} className="border-b px-10 pb-20 pt-10">
            <div className="flex items-center gap-3 pb-5">
              <h3 className="text-xl font-semibold">{event.name}</h3>
              <div className="flex gap-2">
                <MdPeopleOutline size={24} />
                <span>{numInvitedGuests} Guests Invited</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-7 gap-y-20">
              <AttendanceChart
                event={event}
                numInvitedGuests={numInvitedGuests}
              />
              <QuestionCards questions={event.questions ?? []} />
            </div>
          </div>
        );
      })}
      <GeneralQuestions generalQuestions={generalQuestions} />
    </div>
  );
}

type AttendanceChartProps = {
  event: EventWithGuestResponses;
  numInvitedGuests: number;
};

const AttendanceChart = ({ event, numInvitedGuests }: AttendanceChartProps) => {
  const getChartData = (guestResponses: GuestResponses | null) => {
    return {
      labels: ["Accepted", "Declined", "No Response"],
      datasets: [
        {
          data: [
            guestResponses?.attending ?? 0,
            guestResponses?.declined ?? 0,
            guestResponses?.invited ?? 0,
          ],
          backgroundColor: [
            "rgb(74, 222, 128)",
            "rgb(248, 113, 113)",
            "rgb(229, 231, 235)",
          ],
          hoverOffset: 2,
        },
      ],
    };
  };

  return (
    <div>
      <div className="mb-4 h-[100%] rounded-lg border p-5 pb-0">
        <h5 className="pb-6 text-lg font-semibold">Will you be attending?</h5>
        <div className="flex items-center justify-between gap-7">
          <div className="relative h-full w-40">
            <Doughnut
              data={getChartData(event.guestResponses)}
              options={chartOptions}
            />
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center text-center font-bold leading-tight">
              <span className="text-3xl">
                {event.guestResponses.attending + event.guestResponses.declined}
              </span>
              <div className="w-16 text-center text-xs leading-3">
                of {numInvitedGuests} responded
              </div>
            </div>
          </div>
          <div className="flex w-48 flex-col pr-4">
            <div className="flex items-center justify-between border-b">
              <div className="flex items-center gap-3 py-3">
                <span className={`h-2 w-2 rounded-full bg-green-400`} />
                Accepted
              </div>
              <div className="font-medium">
                {event.guestResponses.attending}
              </div>
            </div>
            <div className="flex items-center justify-between border-b">
              <div className="flex items-center gap-3 py-3">
                <span className={`h-2 w-2 rounded-full bg-red-400`} />
                Declined
              </div>
              <span className="font-medium">
                {event.guestResponses.declined}
              </span>
            </div>
            <div className="flex items-center justify-between border-b">
              <div className="flex items-center gap-3 py-3">
                <span className={`h-2 w-2 rounded-full bg-gray-200`} />
                No Response
              </div>
              <span className="font-medium">
                {event.guestResponses.invited}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Link
        href={`/guest-list?event=${event.id}`}
        className="cursor-pointer text-blue-600"
      >
        Manage Guest List
      </Link>
    </div>
  );
};

const QuestionCards = ({ questions }: { questions: Question[] }) => {
  return (
    <>
      {questions?.map((question) => {
        return (
          <div key={question.id}>
            {question.type === "Text" ? (
              <TextQuestionCard question={question} />
            ) : (
              <OptionQuestionCard question={question} />
            )}
            <Link href="/" className="cursor-pointer text-blue-600">
              Download Responses
            </Link>
          </div>
        );
      })}
    </>
  );
};

const TextQuestionCard = ({ question }: { question: Question }) => {
  if (!question) return <div>Failed to fetch this question.</div>;
  if (
    question._count?.answers === undefined ||
    question.recentAnswer === undefined
  )
    return <div>Failed to get responses for this question.</div>;
  return (
    <div className="mb-4 h-[100%] rounded-md border p-5">
      <h5 className="text-lg font-semibold">{question.text}</h5>
      <div className="flex h-full items-center py-10 pl-6">
        <div className="flex h-full items-center border-r text-center">
          <div className="flex flex-col pr-7">
            <span className="text-3xl">{question._count.answers}</span>
            <span className="text-sm">Responded</span>
          </div>
        </div>
        <div className="flex h-full items-center pl-7">
          {question._count.answers > 0 ? (
            <div className="flex h-full flex-col justify-between">
              <span className="font-light">Most Recent</span>
              <span className="font-bold">
                &quot;{question.recentAnswer?.response}&quot;
              </span>
              <span className="font-light">
                -{" "}
                {`${question.recentAnswer.guestFirstName} ${question.recentAnswer.guestLastName}`}
              </span>
            </div>
          ) : (
            <span>No Responses</span>
          )}
        </div>
      </div>
    </div>
  );
};

// TODO: replace placeholders for question.options and dynamically generate the chart-to-response view based on list of options
const OptionQuestionCard = ({ question }: { question: Question }) => {
  const getChartData = () => {
    return {
      labels: ["Yes", "No", "No Response"],
      datasets: [
        {
          data: [6, 2, 11],
          backgroundColor: [
            "rgb(250 204 21)",
            "rgb(96 165 250)",
            "rgb(229, 231, 235)",
          ],
          hoverOffset: 2,
        },
      ],
    };
  };

  const questionResponses = 1337;
  return (
    <div className="mb-4 h-[100%] rounded-md border p-5">
      <h5 className="pb-6 text-lg font-semibold">Song Request?</h5>
      <div className="flex items-center justify-between gap-7">
        <div className="relative h-full w-40">
          <Doughnut data={getChartData()} options={chartOptions} />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center text-center font-bold leading-snug">
            <span className="text-3xl">{questionResponses}</span>
            <span className="text-xs">responded</span>
          </div>
        </div>
        <div className="flex w-48 flex-col pr-4">
          <div className="flex items-center justify-between border-b">
            {/* map through multiple choice options */}
            <div className="flex items-center gap-3 py-3">
              <span className={`h-2 w-2 rounded-full bg-yellow-400`} />
              Justin Bieber
            </div>
            <div className="font-medium">6</div>
          </div>
          <div className="flex items-center justify-between border-b">
            {/* map through multiple choice options */}
            <div className="flex items-center gap-3 py-3">
              <span className={`h-2 w-2 rounded-full bg-blue-400`} />
              Ariana Grande
            </div>
            <div className="font-medium">2</div>
          </div>
          <div className="flex items-center justify-between border-b">
            {/* map through multiple choice options */}
            <div className="flex items-center gap-3 py-3">
              <span className={`h-2 w-2 rounded-full bg-gray-200`} />
              Adele
            </div>
            <div className="font-medium">11</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GeneralQuestions = ({
  generalQuestions,
}: {
  generalQuestions: Question[];
}) => {
  return (
    <div className="p-10">
      <h3 className="pb-6 text-2xl font-semibold">General Questions</h3>
      <div className="mb-3 grid grid-cols-2 gap-x-7 gap-y-20">
        <QuestionCards questions={generalQuestions} />
      </div>
      <Link href="/" className="cursor-pointer text-blue-600">
        Download All Responses
      </Link>
    </div>
  );
};
