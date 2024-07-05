const { faker } = require("@faker-js/faker");
const { ethers, run, network } = require("hardhat");
const fs = require("fs");

// 将输入的数字转换为以太币的 Wei 单位
const toWei = (num) => ethers.utils.parseEther(num);

const shuffleArray = (array) => {
  for (let i = 0; i < array.length; i++) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const addMinutes = (minutes) => {
  const currentDate = new Date();
  const millisecondsPerMinute = 60 * 1000;
  const newTimestamp = currentDate.getTime() + minutes * millisecondsPerMinute;
  return newTimestamp;
};

const getParams = (iteration) => {
  const imageUrls = [
    "/icons8-pretzel-94.png",
    "/icons8-raspberry-94.png",
    "/bitcoin-2.svg",
    "/bitcoin-3.svg",
    "/bitcoin.svg",
    "/bitcoin-1.svg",
  ];

  const title = faker.random.words(5);
  const description = faker.lorem.paragraph(1);
  const image = shuffleArray(imageUrls)[0];
  const prize = toWei(faker.finance.amount(8, 16));
  const ticketPrice = toWei(faker.finance.amount(0.01, 0.05));
  const expiresAt = addMinutes(5 * iteration);
  return {
    title,
    description,
    image,
    prize,
    ticketPrice,
    expiresAt,
  };
};

async function main() {
  let servicePercent = 7;
  let contractFactory = await ethers.getContractFactory("DappLottery");
  console.log("Deploying, please wait... ");
  let contract = await contractFactory.deploy(servicePercent);
  await contract.deployed();

  const iteration = 6;
  let tx, result;

  const createLottery = async ({
    title,
    description,
    image,
    prize,
    ticketPrice,
    expiresAt,
  }) => {
    tx = await contract.functions.createLottery(
      title,
      description,
      image,
      prize,
      ticketPrice,
      expiresAt
    );
    await tx.wait();
  };
  for (let i = 1; i <= iteration; i++) {
    const obj = getParams(iteration * i);
    console.log(i, obj);
    await createLottery(obj);
  }
  result = await contract.functions.getLotteries();
  const address = JSON.stringify({ address: contract.address }, null, 4);

  fs.writeFile(
    "./artifacts/contractAddress.json",
    address,
    "utf8",
    function (error) {
      if (error) {
        console.log(error);
        throw error;
      }
      console.log(`Deployed contract to: ${address}`);
    }
  );
}
main()
  .then(() => {
    // process.exit(0);
  })
  .catch((error) => {
    console.log("error--->", error);
    process.exit(1);
  });
