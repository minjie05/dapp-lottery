import Head from "next/head";
import { Navbar } from "@/components/Navbar";
import { JackpotTable } from "@/components/JackpotTable";
import { Generator } from "@/components/Generator";
import {
  getLottery,
  getLuckyNumbers,
  getPurchaseNumbers,
} from "@/services/blockchain.jsx";

export default function Jackpot({ lottery, luckyNumbers, numbersPurchased }) {
  return (
    <div className="overflow-hidden">
      <Head>
        <title>Dapp-Lottery - Jackpot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <JackpotTable
        jackpot={lottery}
        luckyNumbers={luckyNumbers}
        participants={numbersPurchased}
      />
      <Generator />
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { jackpotId } = context.query;
  const lottery = await getLottery(jackpotId);
  const luckyNumbers = await getLuckyNumbers(jackpotId);
  const purchaseNumbers = await getPurchaseNumbers(jackpotId);

  return {
    props: {
      lottery: JSON.parse(JSON.stringify(lottery)),
      luckyNumbers:
        luckyNumbers.length > 0 ? JSON.parse(JSON.stringify(luckyNumbers)) : [],
      numbersPurchased: JSON.parse(JSON.stringify(purchaseNumbers)),
    },
  };
};
