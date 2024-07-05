import Head from "next/head";
import { Navbar } from "@/components/Navbar";
import { Section } from "@/components/Section";
import { Jackpots } from "@/components/Jackpots";
import { getLotteries } from "@/services/blockchain.jsx";

export default function Home({ jackpots }) {
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
  const lotteries = await getLotteries();

  return {
    props: {
      jackpots: JSON.parse(JSON.stringify(lotteries)),
    },
  };
};
