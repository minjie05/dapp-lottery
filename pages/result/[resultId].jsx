import Head from "next/head";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ResultTable } from "@/components/ResultTable";
import { Winners } from "@/components/winners";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "@/store/globalSlices";
import {
  getLottery,
  getLotteryResult,
  getParticipants,
} from "@/services/blockchain.jsx";

export default function Result({ lottery, participantLists, lotteryResult }) {
  const dispatch = useDispatch();
  const { setLottery, setResult, setParticipantList } = globalActions;

  const { jackpot, result, participantList } = useSelector(
    (state) => state.globalState
  );

  useEffect(() => {
    dispatch(setLottery(lottery));
    dispatch(setResult(lotteryResult));
    dispatch(setParticipantList(participantLists));
  }, []);

  return (
    <div className="overflow-hidden">
      <Head>
        <title>Dapp-Lottery - Result</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <ResultTable
        jackpot={jackpot}
        participantList={participantList}
        lotteryResult={result}
      />
      <Winners />
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { resultId } = context.query;
  const lottery = await getLottery(resultId);
  const participantList = await getParticipants(resultId);
  const lotteryResult = await getLotteryResult(resultId);

  return {
    props: {
      lottery: JSON.parse(JSON.stringify(lottery)),
      participantLists: JSON.parse(JSON.stringify(participantList)),
      lotteryResult: JSON.parse(JSON.stringify(lotteryResult)),
    },
  };
};
