import Image from "next/image";
import Link from "next/link";
import { truncate } from "@/utils/index";

export const Jackpots = ({ jackpots }) => {
  return (
    <div className="pt-5 bg-slate-100">
      <div>
        <h1 className="text-xl font-extrabold text-center">Lottery Jackpots</h1>
        <p className="text-center mt-3">
          We bring a persolan and effective every project we work on. <br />
          which is why our client love why they keep coming back.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-6 mx-auto py-10 w-4/5">
        {jackpots?.map((jackpot, i) => (
          <Jackpot jackpot={jackpot} key={i} />
        ))}
      </div>
    </div>
  );
};

const Jackpot = ({ jackpot }) => {
  return (
    <div className="w-full rounded-lg shadow-lg shadow-grey bg-[#fff7ed] overflow-hidden px-3 py-5 my-2">
      <div className="flex justify-start items-center space-x-2">
        <Image
          width={80}
          height={80}
          src={jackpot.image}
          alt="icon"
          className="w-20 rounded-lg"
        />
        <div>
          <p className="text-[#c2410c] font-bold">Upto: {jackpot.price} ETH</p>
          <p className="text-gray-500 font-medium">
            Draws On: {jackpot.drawsAt}
          </p>
        </div>
      </div>
      <div className="py-5 h-36">
        <p className="text-[#c2410c] font-bold">{jackpot.title}</p>
        <p className="text-gray-500 font-medium">
          {truncate(jackpot.description, 100, 0, 103)}
        </p>
      </div>
      <Link
        href={"/jackpots/" + jackpot.id}
        className="bg-[#fbbf24] rounded-md py-2 px-5 text-white font-semibold"
      >
        PLAY NOW
      </Link>
    </div>
  );
};
