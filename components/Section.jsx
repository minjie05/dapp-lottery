import Image from "next/image";
import Link from "next/link";

export const Section = () => {
  return (
    <div
      className="min-h-screen bg-[#fed7aa] flex flex-col justify-center 
    items-center pt-24 text-[#ea580c] px-5 lg:flex-row lg:px-32 lg:justify-center"
    >
      {/**content section */}
      <div className="space-y-4">
        <h1 className="text-5xl font-semibold w-full text lg:w-3/4">
          Take the chance to Change your life
        </h1>
        <p className="w-full font-medium lg:w-3/4">
          We bring a persolan and effective to every project we work on. which
          is why client love why they keep coming back.
        </p>
        <div className="bg-[#ea580c] text-white px-4 py-2 font-medium inline-block">
          <Link href={"/create"}>Create Jackpot</Link>
        </div>
      </div>
      {/**img section */}
      <div className="p-5">
        <Image
          src="/prize_new.png"
          width={700}
          height={700}
          alt="lottery"
          className=""
        />
      </div>
    </div>
  );
};
