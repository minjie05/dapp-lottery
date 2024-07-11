import React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { FaEthereum } from "react-icons/fa";
import { CountDown } from "@/components/CountDown";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "@/store/globalSlices";
import { buyTickets } from "@/services/blockchain";

export const JackpotTable = ({ jackpot, luckyNumbers, participants }) => {
  const router = useRouter();
  const { jackpotId } = router.query;
  const { setGereratorModal } = globalActions;
  const { wallet } = useSelector((state) => state.globalState);
  const dispatch = useDispatch();

  const handlePurchase = async (index) => {
    if (!wallet) return toast.warning("Connect your wallet.");
    if (index == undefined) return;

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await buyTickets(jackpotId, index, jackpot?.ticketPrice)
          .then(() => {
            resolve();
          })
          .catch(() => reject());
      }),
      {
        pending: "Approve transaction...",
        success: "Jackpot created successfully 👌",
        reject: "Encountered error 🤯",
        error: "Encountered error 🤯",
      }
    );
  };

  const onGenerate = () => {
    if (luckyNumbers.length > 0) return toast.warning("Already generated");
    dispatch(setGereratorModal("scale-100"));
  };

  return (
    <div className="px-5 bg-slate-100 py-10 h-screen">
      <div className="flex flex-col items-center justify-center text-center py-10">
        <h4 className="text-4xl text-slate-700 font-bold pb-3">
          Buy Lottery Online
        </h4>
        <p className="text-lg text-gray-600 font-semibold capitalize">
          {jackpot?.title}
        </p>
        <p className="text-sm text-gray-500 w-full sm:w-2/3">
          {jackpot?.description}
        </p>
        <p className="text-sm font-medium text-black w-full sm:w-2/3">
          {jackpot?.participants} participants
        </p>
      </div>
      <div className="flex flex-col justify-end items-center mb-10 space-y-4">
        {jackpot?.expiresAt ? (
          <CountDown timestamp={jackpot?.expiresAt}></CountDown>
        ) : null}

        <div className="flex justify-center items-center space-x-2">
          {wallet?.toLowerCase() == jackpot?.owner ? (
            <button
              className={`border text-white bg-amber-500 
            rounded-full px-4 py-2 font-semibold ${
              jackpot?.expiresAt < Date.now()
                ? "bg-gray-500"
                : "hover:bg-[#ea580c]"
            }`}
              onClick={onGenerate}
              disabled={jackpot?.expiresAt < Date.now()}
            >
              Generate Lucky Numbers
            </button>
          ) : null}

          <Link
            href={"/result/" + jackpot?.id}
            className="py-2 px-4 boder bg-[#ef4444] rounded-full font-semibold text-white hover:bg-rose-600"
          >
            Draw Result
          </Link>
        </div>
      </div>
      <div className="bg-white text-sm w-full sm:w-3/4 mx-auto p-10 rounded-md flex flex-col">
        <div className="pb-4 text-center">
          <p className="text-2xl font-semibold">
            Select Your winning Lottery Numbers
          </p>
        </div>
        <table className="table-auto  overflow-y-auto block max-h-80">
          <thead className="block sticky top-0 bg-white">
            <tr className="flex justify-between text-left">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Ticket Price</th>
              <th className="px-4 py-2">Draw Date</th>
              <th className="px-4 py-2">Ticket Number</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="block">
            {luckyNumbers?.length > 0 &&
              luckyNumbers?.map((luckyNumber, i) => (
                <tr className="flex justify-between text-left border">
                  <td className="px-4 py-3 font-semibold">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold">
                    <FaEthereum size={20} className="inline-block mr-1" />
                    <span>{jackpot?.ticketPrice}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {jackpot?.drawsAt}
                  </td>
                  <td className="px-4 py-3 font-semibold">{luckyNumber}</td>
                  <td>
                    <button
                      onClick={() => {
                        handlePurchase(i);
                      }}
                      className={`text-white bg-[#ea580c] rounded-full py-2 
                      px-4 mt-1 ${
                        participants.includes(luckyNumber)
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-rose-600"
                      }`}
                    >
                      BUY NOW
                    </button>
                  </td>
                </tr>
              ))}
            {luckyNumbers?.length == 0 && (
              <div className="flex justify-center p-5">
                <Image
                  src="/empty-icon.png"
                  width={200}
                  height={300}
                  alt="empty"
                  className=""
                ></Image>
              </div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
