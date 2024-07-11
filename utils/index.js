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

export const structureLotteries = (lotteries) => {
  let res = [];
  lotteries.map((lottery) => {
    let obj = {
      id: Number(lottery.id),
      title: lottery.title,
      description: lottery.description,
      image: lottery.image,
      prize: fromWei(lottery.prize),
      ticketPrice: fromWei(lottery.ticketPrice),
      participants: Number(lottery.participants),
      drawn: lottery.drawn,
      owner: lottery.owner.toLowerCase(),
      createAt: formatDate(Number(lottery.createAt + "000")),
      expiresAt: Number(lottery.expiresAt),
      drawsAt: formatDate(Number(lottery.expiresAt)),
    };
    res.push(obj);
    return obj;
  });

  return res.length > 1 ? res : res[0];
};

export const reportError = (error) => {
  console.log("error.message:", error.message);
};

export const generatorLuckyNumbers = (length) => {
  const charaters =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
  const result = [];
  for (let i = 0; i < length; i++) {
    let str = "";
    for (let j = 0; j < 6; j++) {
      str += charaters.charAt(Math.floor(Math.random() * charaters.length));
    }
    result.push(str);
  }
  return result;
};

export const structuredParticipants = (participants) => {
  let res = [];
  participants.map((item) => {
    res.push({
      account: item[0].toLowerCase(),
      lotteryNumber: item[1],
      paid: item[2],
    });
  });
  return res;
};

export const structuredNumber = (participants) => {
  const res = [];

  for (let i = 0; i < participants.length; i++) {
    let temp = participants[i][1];
    res.push(temp);
  }

  return res;
};

export const structuredResult = (result) => {
  const LotteryResult = {
    id: Number(result[0]),
    completed: result[1],
    paidout: result[2],
    timestamp: Number(result[3]),
    sharePerWinner: fromWei(result[4] || 0),
    winners: [],
  };

  for (let i = 0; i < result[5]?.length; i++) {
    const winner = result[5][i][1];
    LotteryResult.winners.push(winner);
  }

  return LotteryResult;
};
