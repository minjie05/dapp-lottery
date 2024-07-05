import Head from 'next/head'
import { Navbar } from '@/components/Navbar'
import { JackpotTable } from '@/components/JackpotTable'
import { Generator } from '@/components/Generator'
import {
  generateLottery,
  generateLotteryParticipants,
  getPurchaseNumbers,
} from '@/services/fakeData'
import { useState } from 'react'

export default function Jackpot({ lottery, lotteryNumbers, numbersPurchased }) {
  console.log('Jackpot---function --->', lottery, lotteryNumbers, numbersPurchased)

  return (
    <div className="overflow-hidden">
      <Head>
        <title>Dapp-Lottery - Jackpot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <JackpotTable
        jackpot={lottery}
        luckyNumbers={lotteryNumbers}
        participants={numbersPurchased}
      />
      <Generator />
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const { jackpotId } = context.query
  const lottery = generateLottery(jackpotId)
  const purchaseNumbers = getPurchaseNumbers(5)
  const lotteryNumbers = getPurchaseNumbers(5)

  return {
    props: {
      lottery: JSON.parse(JSON.stringify(lottery)),
      lotteryNumbers: JSON.parse(JSON.stringify(lotteryNumbers)),
      numbersPurchased: JSON.parse(JSON.stringify(purchaseNumbers)),
    },
  }
}
