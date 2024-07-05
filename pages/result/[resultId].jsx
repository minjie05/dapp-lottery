import Head from 'next/head'
import { Navbar } from '@/components/Navbar'
import { ResultTable } from '@/components/ResultTable'
import { Winners } from '@/components/winners'
import { generateLottery, generateLotteryParticipants } from '@/services/fakeData'

export default function Result({ lottery, participantList, lotteryResult }) {
  console.log('Result---function --->', lottery, participantList, lotteryResult)

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
  )
}

export const getServerSideProps = async (context) => {
  const { jackpotId } = context.query
  const lottery = generateLottery(jackpotId)
  const participantList = generateLotteryParticipants(6)
  const lotteryResult = []

  return {
    props: {
      lottery: JSON.parse(JSON.stringify(lottery)),
      participantList: JSON.parse(JSON.stringify(participantList)),
      lotteryResult: JSON.parse(JSON.stringify(lotteryResult)),
    },
  }
}
