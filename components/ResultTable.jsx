import React from "react";
import Link from "next/link";
import { FaEthereum } from "react-icons/fa";
import Identicon from "react-identicons";
import { CountDown } from "@/components/countdown";
import { truncate } from "@/utils/index";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "@/store/globalSlices";

export const ResultTable = ({ jackpot, participantList, lotteryResult }) => {
  const { setWinnersModal } = globalActions;
  const { winnersModal } = useSelector((state) => state.globalState);
  const dispatch = useDispatch();

  return (
    <div className="px-5 bg-slate-100 py-10 ">
      <div className="flex flex-col items-center justify-center text-center py-10">
        <h4 className="text-4xl text-slate-700 font-bold pb-3">
          Lottery Result
        </h4>
        <p className="text-lg text-gray-600 font-semibold capitalize">
          {jackpot?.title}
        </p>
        <p className="text-sm text-gray-500 w-full sm:w-2/3">
          {jackpot?.description}
        </p>
        <p className="text-sm font-medium text-black w-full sm:w-2/3">
          Result for{""}
          <span className="font-medium text-[#ef4444]">
            {lotteryResult?.winners?.lenght} winners
          </span>{" "}
          out of{" "}
          <span className="font-medium  text-[#ef4444]">
            {jackpot?.participants} participants
          </span>{" "}
          <span className="font-medium">
            {lotteryResult?.winners?.length > 0 ? "Drawn" : "Not Drawn"}
          </span>
        </p>
      </div>
      <div className="flex flex-col justify-end items-center mb-10 space-y-4">
        {jackpot?.expiresAt ? (
          <CountDown timestamp={jackpot?.expiresAt}></CountDown>
        ) : null}
        <div className="flex justify-center items-center space-x-2">
          <button
            className="border text-white bg-amber-500 rounded-full 
          px-4 py-2 font-semibold hover:bg-[#ea580c]"
            onClick={() => dispatch(setWinnersModal("scale-100"))}
          >
            Perform Draw
          </button>
          <Link
            href={"/jackpots/" + jackpot?.id}
            className="py-2 px-4 boder bg-gray-500 rounded-full font-semibold text-white hover:bg-rose-600"
          >
            Jackpot
          </Link>
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row">
        <div className="bg-white flex flex-col w-full sm:w-3/4 mx-auto p-5 rounded-md">
          <h4 className="text-2xl font-bold text-slate-700 text-center">
            Winners & Lossers
          </h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {participantList?.map((participant, i) => (
              <div
                key={i}
                className="flex justify-start items-center border-b border-gray-100 py-2 space-x-2"
              >
                <Identicon
                  size={30}
                  string={participant.account}
                  className="rounded-full h-12 w-12"
                />
                <div className="flex justify-center items-center space-x-2 text-sm">
                  <p className="font-semibold text-lg text-slate-500">
                    {truncate(participant.account, 4, 4, 11)}
                  </p>
                  <p className="text-slate-500">{participant.lotteryNumber}</p>
                  {lotteryResult?.winners?.includes(
                    participant.lotteryNumber
                  ) ? (
                    <p className="text-green-500 flex justify-start items-center">
                      + <FaEthereum /> {lotteryResult?.sharePerWinner}{" "}
                      {" winner"}
                    </p>
                  ) : (
                    <p className="text-red-500 flex justify-start items-center">
                      -<FaEthereum />
                      {jackpot?.ticketPrice}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
