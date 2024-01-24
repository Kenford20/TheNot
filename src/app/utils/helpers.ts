// format: January 1, 2024
function formatDateStandard(date: Date | null | undefined) {
  if (!date) return;
  return date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// format: 01.24.2024
function formatDateNumber(date: Date | null | undefined) {
  if (!date) return;
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [month, day, year].join(".");
}

// format: Sunday, Jan. 1
function convertDate(date: Date | null) {
  if (!date) return date;
  const day = date.getDay();
  const month = date.getMonth();
  const datee = date.getDate();

  const abbreviatedMonths = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return `${daysOfTheWeek[day]}, ${abbreviatedMonths[month]} ${datee + 1}`;
}

// returns an array of times from 12pm to 11:45am (24hrs) in 15min increments
function generateTimes() {
  const times = [];
  for (let i = 720; i <= 2145; i += 15) {
    let hours = Math.floor(i / 60);
    let minutes: number | string = i % 60;
    if (minutes < 10) minutes = "0" + minutes.toString();
    const ampm = hours % 24 < 12 ? "AM" : "PM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    times.push(`${hours}:${minutes} ${ampm}`);
  }
  return times;
}

export { formatDateStandard, formatDateNumber, convertDate, generateTimes };
