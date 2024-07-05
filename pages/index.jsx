import Head from "next/head";
import { Navbar } from "@/components/Navbar";
import { Section } from "@/components/Section";
import { Jackpots } from "@/components/Jackpots";
import { generateLotteries } from "@/services/fakeData";
import { getLotteries } from "@/services/blockchain.jsx";

export default function Home({ jackpots, lotteries }) {
  console.log("Home--->", lotteries);
  return (
    <div>
      <Head>
        <title>Dapp-Lottery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Navbar />
        <Section />
        <Jackpots jackpots={jackpots} />
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const data = await generateLotteries(7);
  const lotteries = await getLotteries();

  return {
    props: {
      jackpots: JSON.parse(JSON.stringify(data)),
      lotteries: JSON.parse(JSON.stringify(lotteries)),
    },
  };
};
