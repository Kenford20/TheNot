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

export { formatDateNumber, convertDate };
