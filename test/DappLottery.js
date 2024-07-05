const { expect } = require("chai");
const { faker } = require("@faker-js/faker");
const { ethers, run, network } = require("hardhat");

// 将输入的数字转换为以太币的 Wei 单位
const toWei = (num) => ethers.parseEther(num.toString());
// 假设你有一个值为 1000000000000000000 的值，这是 1 Ether 的 Wei 表示
// 使用 fromWei 函数将这个值转换回 Ether
const fromWei = (num) => ethers.utils.formatEther(num);

const addDays = (days) => {
  const currentDate = new Date();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const newTimestamp = currentDate.getTime() + days * millisecondsPerDay;
  return newTimestamp;
};

const generateLuckyNumbers = (count) => {
  const charaters =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
  const result = [];
  for (let i = 0; i < count; i++) {
    let str = "";
    for (let j = 0; j < 6; j++) {
      str += charaters.charAt(Math.floor(Math.random() * charaters.length));
    }
    result.push(str);
  }
  return result;
};

describe("DappLottery", function () {
  let contractFactory, contract, result;
  let servicePercent = 10;
  const title = faker.word.adjective(5);
  const description = faker.lorem.paragraph(1);
  const image = faker.image.url();
  const prize = toWei(10);
  const ticketPrice = toWei(0.01);
  const expiresAt = addDays(10);
  const lotteryId = 1;
  const numberToGenerate = 5;
  const numberOfWinners = 2;
  console.log("111");
  // deploy the smart contract into the network

  beforeEach(async function () {
    contractFactory = await ethers.getContractFactory("DappLottery");
    [
      serviceAccount,
      participant1,
      participant2,
      participant3,
      participant4,
      participant5,
    ] = await ethers.getSigners(); // 返回以太坊账户
    console.log("Deploying, please wait... ");
    contract = await contractFactory.deploy(servicePercent);
  });

  describe("Deployed State", function () {
    it("Should confirm deployment info", async function () {
      let owner = await contract.owner();
      expect(owner).to.be.equal(serviceAccount.address);
      result = await contract.servicePercent();
      expect(result).to.be.equal(servicePercent);
    });
  });

  describe("Lottery Creation", () => {
    it("Should confirm Lottery creation", async function () {
      result = await contract.getLotteries();

      expect(result.toString()).to.have.lengthOf("0");

      await contract.createLottery(
        title,
        description,
        image,
        prize,
        ticketPrice,
        expiresAt
      );
      result = await contract.getLotteries();
      expect(result).to.have.lengthOf(1);
    });
  });

  describe("LuckyNumber Generation", () => {
    beforeEach(async () => {
      await contract.createLottery(
        title,
        description,
        image,
        prize,
        ticketPrice,
        expiresAt
      );
    });
    it("Should confirm LuckyNumber import", async function () {
      result = await contract.getLotteryLuckyNumbers(lotteryId);
      expect(result).to.have.lengthOf(0);

      await contract.importLuckyNumbers(
        lotteryId,
        generateLuckyNumbers(numberToGenerate)
      );

      result = await contract.getLotteryLuckyNumbers(lotteryId);
      expect(result).to.have.lengthOf(numberToGenerate);
    });
  });

  describe("Buying of Tickets", function () {
    beforeEach(async () => {
      await contract.createLottery(
        title,
        description,
        image,
        prize,
        ticketPrice,
        expiresAt
      );
      await contract.importLuckyNumbers(
        lotteryId,
        generateLuckyNumbers(numberToGenerate)
      );
    });
    it("Should confirm ticket purchase", async function () {
      result = await contract.getLottery(lotteryId);
      expect(result.participants.toString()).to.be.equal("0");

      result = await contract.getLotteryParticipants(lotteryId);
      expect(result).to.have.lengthOf(0);

      // use another account
      await contract
        .connect(participant1)
        .buyTicket(lotteryId, numberToGenerate - 1, {
          value: ticketPrice,
        });

      result = await contract.getLottery(lotteryId);
      expect(result.participants.toString()).to.be.equal("1");

      result = await contract.getLotteryParticipants(lotteryId);
      expect(result).to.have.lengthOf(1);
    });
  });

  describe("Selecting Winners", function () {
    beforeEach(async () => {
      await contract.createLottery(
        title,
        description,
        image,
        prize,
        ticketPrice,
        expiresAt
      );
      await contract.importLuckyNumbers(
        lotteryId,
        generateLuckyNumbers(numberToGenerate)
      );
      await contract
        .connect(participant1)
        .buyTicket(lotteryId, numberToGenerate - 1, {
          value: ticketPrice,
        });
      await contract
        .connect(participant2)
        .buyTicket(lotteryId, numberToGenerate - 2, {
          value: ticketPrice,
        });
      await contract
        .connect(participant3)
        .buyTicket(lotteryId, numberToGenerate - 3, {
          value: ticketPrice,
        });
      await contract
        .connect(participant4)
        .buyTicket(lotteryId, numberToGenerate - 4, {
          value: ticketPrice,
        });
      await contract
        .connect(participant5)
        .buyTicket(lotteryId, numberToGenerate - 5, {
          value: ticketPrice,
        });
    });
    it("Should confirm random selection of winners", async function () {
      result = await contract.getLottery(lotteryId);
      expect(result.participants.toString()).to.be.equal(
        numberToGenerate.toString()
      );

      result = await contract.getLotteryResult(lotteryId);
      expect(result.winners).to.have.lengthOf(0);

      await contract.randomSlectWinners(lotteryId, numberOfWinners);

      result = await contract.getLotteryResult(lotteryId);
      expect(result.winners).to.have.lengthOf(numberOfWinners);
    });
  });

  describe("Buying of Tickets", function () {
    beforeEach(async () => {
      await contract.createLottery(
        title,
        description,
        image,
        prize,
        ticketPrice,
        expiresAt
      );
      await contract.importLuckyNumbers(
        lotteryId,
        generateLuckyNumbers(numberToGenerate)
      );
    });
    it("Should confirm ticket purchase", async function () {
      result = await contract.getLottery(lotteryId);
      expect(result.participants.toString()).to.be.equal("0");

      result = await contract.getLotteryParticipants(lotteryId);
      expect(result).to.have.lengthOf(0);

      // use another account
      await contract
        .connect(participant1)
        .buyTicket(lotteryId, numberToGenerate - 1, {
          value: ticketPrice,
        });

      result = await contract.getLottery(lotteryId);
      expect(result.participants.toString()).to.be.equal("1");

      result = await contract.getLotteryParticipants(lotteryId);
      expect(result).to.have.lengthOf(1);
    });
  });

  describe("Paying Winners", function () {
    beforeEach(async () => {
      await contract.createLottery(
        title,
        description,
        image,
        prize,
        ticketPrice,
        expiresAt
      );
      await contract.importLuckyNumbers(
        lotteryId,
        generateLuckyNumbers(numberToGenerate)
      );
      await contract
        .connect(participant1)
        .buyTicket(lotteryId, numberToGenerate - 1, {
          value: ticketPrice,
        });
      await contract
        .connect(participant2)
        .buyTicket(lotteryId, numberToGenerate - 2, {
          value: ticketPrice,
        });
      await contract
        .connect(participant3)
        .buyTicket(lotteryId, numberToGenerate - 3, {
          value: ticketPrice,
        });
      await contract
        .connect(participant4)
        .buyTicket(lotteryId, numberToGenerate - 4, {
          value: ticketPrice,
        });
      await contract
        .connect(participant5)
        .buyTicket(lotteryId, numberToGenerate - 5, {
          value: ticketPrice,
        });
    });
    it("Should confirm payment of winners", async function () {
      result = await contract.getLottery(lotteryId);
      expect(result.drawn).to.be.equal(false);

      result = await contract.getLotteryResult(lotteryId);
      expect(result.paidout).to.be.equal(false);
      expect(result.winners).to.have.lengthOf(0);

      await contract.randomSlectWinners(lotteryId, numberOfWinners);

      result = await contract.getLottery(lotteryId);
      expect(result.drawn).to.be.equal(true);

      result = await contract.getLotteryResult(lotteryId);
      expect(result.paidout).to.be.equal(true);
      expect(result.winners).to.have.lengthOf(numberOfWinners);
    });
  });
});
