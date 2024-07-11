import Head from "next/head";
import { Navbar } from "@/components/Navbar";
import { ResultTable } from "@/components/ResultTable";
import { Winners } from "@/components/winners";
import {
  getLottery,
  getLuckyNumbers,
  getParticipants,
} from "@/services/blockchain.jsx";

export default function Result({ lottery, participantList, lotteryResult }) {
  return (
    <div className="overflow-hidden">
      <Head>
        <title>Dapp-Lottery - Result</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <ResultTable
        jackpot={lottery}
        participantList={participantList}
        lotteryResult={lotteryResult}
      />
      <Winners />
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { resultId } = context.query;
  const lottery = await getLottery(resultId);

  const participantList = await getParticipants(resultId);
  const lotteryResult = [];

  return {
    props: {
      lottery: JSON.parse(JSON.stringify(lottery)),
      participantList: JSON.parse(JSON.stringify(participantList)),
      lotteryResult: JSON.parse(JSON.stringify(lotteryResult)),
    },
  };
};
