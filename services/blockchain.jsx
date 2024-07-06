import { store } from "@/store";
import { ethers } from "ethers";
import { globalActions } from "@/store/globalSlices";
import address from "@/artifacts/contractAddress.json";
import abi from "@/artifacts/contracts/DappLottery.sol/DappLottery.json";
import { toWei, fromWei, reportError, structureLotteries } from "@/utils/index";

const { setWallet } = globalActions;
const contractAddress = address.address;
const contractAbi = abi.abi;
let tx, ethereum;

// 确保在浏览器环境中
// window.ethereum是MetaMask等以太坊钱包在浏览器窗口对象中的实例。
// 通过检查ethereum是否存在，开发者可以确定用户是否安装了兼容的以太坊钱包。
if (typeof window !== "undefined") {
  ethereum = window.ethereum;
}

// 用于连接MetaMask, 和交易时的签名
const csrEthreumContract = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  // 这里的签名是MetaMask提供的
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  return contract;
};

export const createJackpot = async ({
  title,
  description,
  image,
  prize,
  ticketPrice,
  expiresAt,
}) => {
  try {
    if (!ethereum) return reportError("Please install Mestmask");
    const wallet = store.getState().globalState.wallet;
    const contract = await csrEthreumContract();

    tx = await contract.createLottery(
      title,
      description,
      image,
      toWei(prize),
      toWei(ticketPrice),
      expiresAt,
      {
        from: wallet,
      }
    );
    await tx.wait();
  } catch (error) {
    reportError(error);
  }
};

// 务器端渲染时初始化一个Ethereum合约，以便在客户端与之交互
// just read the data from the blockchain
export const ssrEthereumContract = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );
  const wallet = ethers.Wallet.createRandom();

  // Set the new account as the signer for the provider
  const signer = provider.getSigner(wallet.address);
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  return contract;
};

// pull data from the blockchain
export const getLotteries = async () => {
  const contract = await ssrEthereumContract();
  const lotteries = await contract.functions.getLotteries();

  return structureLotteries(lotteries[0]);
};

export const getLottery = async (id) => {
  const contract = await ssrEthereumContract();
  const lottery = await contract.functions.getLottery(id);

  return structureLotteries(lottery);
};

export const connectWallet = async () => {
  try {
    if (!ethereum) return reportError("Please install Mestmask");
    // { method: "eth_requestAccounts" }表示请求用户授权访问其以太坊账户
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    store.dispatch(setWallet(accounts[0]));
  } catch (error) {
    reportError(error);
  }
};

// keep the wallet connection alive
export const monitorWalletConnection = async () => {
  try {
    if (!ethereum) return reportError("Please install Mestmask");
    const accounts = await ethereum.request({ method: "eth_accounts" });

    // chainChanged事件，当区块链网络（链）发生变化时（即用户切换了链，
    // 例如从以太坊主网切换到Ropsten测试网），页面会自动刷新
    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async (chainId) => {
      store.dispatch(setWallet(accounts[0]));
      await monitorWalletConnection();
    });

    if (accounts.length) {
      store.dispatch(setWallet(accounts[0]));
    } else {
      store.dispatch(setWallet(""));
      reportError("Please, connect wallet, no accounts found");
    }
  } catch (error) {
    reportError(error);
  }
};
