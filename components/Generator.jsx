import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "@/store/globalSlices";
import { generatorLuckyNumbers } from "@/utils/index";
import { exportLuckyNumbers } from "@/services/blockchain";

export const Generator = () => {
  const router = useRouter();
  const { jackpotId } = router.query;
  const { setGereratorModal } = globalActions;
  const [luckyNumbers, setLuckyNumbers] = useState("");
  const { gereratorModal } = useSelector((state) => state.globalState);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    console.log(
      "handleSubmit--->",
      jackpotId,
      generatorLuckyNumbers(luckyNumbers)
    );

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await exportLuckyNumbers(jackpotId, generatorLuckyNumbers(luckyNumbers))
          .then(() => {
            setLuckyNumbers("");
            dispatch(setGereratorModal("scale-0"));
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
  return (
    <div
      className={`z-10 fixed top-0 left-0 w-screen h-screen flex items-center justify-center
       bg-black bg-opacity-50 transform transition-transform duration-300 ${gereratorModal}`}
    >
      <div className="bg-white shadow-xl shadow-gray-800 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center">
            <p className="font-semibold">Generator Numbers</p>
            <button
              className="border-0 bg-transparent focus:outline-none"
              onClick={() => dispatch(setGereratorModal("scale-0"))}
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex justify-center items-center bg-[#fed7aa] rounded-xl p-2.5 my-5">
            <input
              type="number"
              step={1}
              min={1}
              name="luckyNumbers"
              placeholder="Lucky Number e.g 19"
              className="block w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-sm"
              onChange={(e) => setLuckyNumbers(e.target.value)}
              value={luckyNumbers}
            />
          </div>
          <div
            onClick={() => {
              handleSubmit();
            }}
            className="flex flex-row justify-center items-center 
            w-full text-white text-md py-2 px-5 rounded-full drop-shadow-xl bg-[#ea580c] hover:bg-[#c2410c]"
          >
            Generate and Save
          </div>
        </form>
      </div>
    </div>
  );
};
