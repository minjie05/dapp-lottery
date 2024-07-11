import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "@/store/globalSlices";
import { Navbar } from "@/components/Navbar";
import { JackpotTable } from "@/components/JackpotTable";
import { Generator } from "@/components/Generator";
import {
  getLottery,
  getLuckyNumbers,
  getPurchaseNumbers,
} from "@/services/blockchain.jsx";

export default function Jackpot({ lottery, luckyNumber, numbersPurchased }) {
  const dispatch = useDispatch();
  const { setLottery, setLuckyNumbers, setParticipants } = globalActions;
  const { jackpot, luckyNumbers, participants } = useSelector(
    (state) => state.globalState
  );

  useEffect(() => {
    dispatch(setLottery(lottery));
    dispatch(setLuckyNumbers(luckyNumber));
    dispatch(setParticipants(numbersPurchased));
  }, []);

  return (
    <div className="overflow-hidden">
      <Head>
        <title>Dapp-Lottery - Jackpot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <JackpotTable
        jackpot={jackpot}
        luckyNumbers={luckyNumbers}
        participants={participants}
      />
      <Generator />
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { jackpotId } = context.query;
  const jackpot = await getLottery(jackpotId);
  const luckyNumbers = await getLuckyNumbers(jackpotId);
  const participants = await getPurchaseNumbers(jackpotId);

  return {
    props: {
      lottery: JSON.parse(JSON.stringify(jackpot)),
      luckyNumber:
        luckyNumbers.length > 0 ? JSON.parse(JSON.stringify(luckyNumbers)) : [],
      numbersPurchased: JSON.parse(JSON.stringify(participants)),
    },
  };
};
