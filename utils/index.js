import { ethers } from "ethers";

export const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars);
    let end = text.substring(text.length - endChars, text.length);
    while (start.length + end.length < maxLength) {
      start = start + ".";
    }
    return start + end;
  }
  return text;
};

export const toWei = (num) => ethers.utils.parseEther(num.toString());
export const fromWei = (num) => ethers.utils.formatEther(num);

export const formatDate = (timeStamp) => {
  const date = new Date(timeStamp);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const monthOfYear = monthsOfYear[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  return `${dayOfWeek} ${monthOfYear} ${dayOfMonth}, ${year}`;
};
