import Link from "next/link";
import { useState } from "react";
import { RiMenu2Line } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { connectWallet } from "@/services/blockchain.jsx";
import { truncate } from "@/utils/index";

export const Navbar = () => {
  const { wallet } = useSelector((state) => state.globalState);
  console.log("wallet000--->", wallet);
  const [menu, setMenu] = useState(false);

  const handleChange = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  return (
    <header className="fixed w-full z-10">
      <section>
        {/* desktop menu section */}
        <div className="bg-[#fed7aa] w-full flex flex-row justify-between p-5 md:px-32 px-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <div className="text-2xl font-bold cursor-pointer text-[#ea580c]">
            <Link href="/">DappLottery</Link>
          </div>
          {/* nav elements */}
          <nav className="hidden lg:flex flex-row items-center text-lg font-semibold gap-8 text-[#ea580c]">
            <Link href="home" className="cursor-pointer hover:text-[#9a3412]">
              Home
            </Link>
            <Link href="home" className="cursor-pointer hover:text-[#9a3412]">
              How To Play
            </Link>
            <Link href="home" className="cursor-pointer hover:text-[#9a3412]">
              All Lottery
            </Link>
            <Link href="home" className="cursor-pointer hover:text-[#9a3412]">
              Contract
            </Link>
          </nav>
          {/* button */}
          {wallet ? (
            <div className=" bg-[#ea580c] text-white px-4 py-1 rounded-full">
              {truncate(wallet, 4, 4, 11)}
            </div>
          ) : (
            <div className=" bg-[#ea580c] text-white px-4 py-1 rounded-full hover:bg-[#9a3412]">
              <button onClick={connectWallet}>Connect Wallet</button>
            </div>
          )}
          {/**menu icon */}
          <div className="lg:hidden flex items-center">
            {menu ? (
              <AiOutlineClose
                size={28}
                onClick={handleChange}
                className="text-[#ea580c]"
              />
            ) : (
              <RiMenu2Line
                size={28}
                onClick={handleChange}
                className="text-[#ea580c]"
              />
            )}
          </div>
        </div>
        {/* mobilez menu section */}
        <div
          className={`${
            menu ? "translate-x-0" : "-translate-x-full"
          } lg:hidden flex flex-col w-full items-center pt-8 pb-4 gap-8 bg-[#fdba74] text-gray-800 font-semibold text-2xl`}
        >
          <Link
            href="#"
            className="cursor-pointer hover:text-[#ea580c]"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            href="#"
            className="cursor-pointer hover:text-[#ea580c]"
            onClick={closeMenu}
          >
            How To Play
          </Link>
          <Link
            href="#"
            className="cursor-pointer hover:text-[#ea580c]"
            onClick={closeMenu}
          >
            All Lottery
          </Link>
          <Link
            href="#"
            className="cursor-pointer hover:text-[#ea580c]"
            onClick={closeMenu}
          >
            Contract
          </Link>
        </div>
      </section>
    </header>
  );
};
