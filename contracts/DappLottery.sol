// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
/** Ownable合约提供了一个简单的访问控制机制,允许合约所有者执行特定的操作。 */
import "@openzeppelin/contracts/utils/Counters.sol";

/** Counters合约提供了一个简单的计数器功能,可用于跟踪诸如Token ID之类的值。 */

contract DappLottery is Ownable {
    /** 将Counters.Counter的功能附加到Counter类型上 */
    using Counters for Counters.Counter;
    /** 声明一个私有的计数器变量， 用于跟踪已创建的彩票活动的总数 */
    Counters.Counter private _totalLotteries;

    struct LotteryStruct {
        uint256 id;
        string title;
        string description;
        string image;
        uint256 prize;
        uint256 ticketPrice;
        uint256 participants;
        bool drawn;
        address owner;
        uint256 createAt;
        uint256 expiresAt;
    }

    struct ParticipantsStruct {
        address account;
        string lotteryNumber;
        bool paid;
    }

    struct LotteryResultStruct {
        uint256 id;
        bool completed;
        bool paidout;
        /**标识彩票奖金是否已经发放 */
        uint256 timestamp;
        uint256 sharePerWinner;
        /**每个获奖者应该获得的奖金份额 */
        ParticipantsStruct[] winners;
    }

    mapping(uint256 => LotteryStruct) lotteries;
    mapping(uint256 => ParticipantsStruct[]) lotteryParticipants;
    mapping(uint256 => string[]) lotteryLuckyNumbers;
    mapping(uint256 => mapping(uint256 => bool)) luckyNumberUsed;
    mapping(uint256 => LotteryResultStruct) lotteryResult;

    uint256 public servicePercent;
    uint256 public serviceBalance;

    constructor(uint256 _servicePercent) {
        servicePercent = _servicePercent;
    }

    function createLottery(
        string memory title,
        string memory description,
        string memory image,
        uint256 prize,
        uint256 ticketPrice,
        uint256 expiresAt
    ) public {
        require(bytes(title).length > 0, "title cannot be empty");
        require(bytes(description).length > 0, "description cannot be empty");
        require(bytes(image).length > 0, "image cannot be empty");
        require(prize > 0 ether, "prize cannot be zero");
        require(ticketPrice > 0 ether, "ticketPrice cannot be zero");
        require(
            expiresAt > currentTime(),
            "expiresAt cannot be less than the future"
        );

        _totalLotteries.increment();
        LotteryStruct memory lottery;

        lottery.id = _totalLotteries.current();
        lottery.title = title;
        lottery.description = description;
        lottery.image = image;
        lottery.prize = prize;
        lottery.ticketPrice = ticketPrice;
        lottery.owner = msg.sender;
        lottery.createAt = currentTime();
        lottery.expiresAt = expiresAt;

        lotteries[lottery.id] = lottery;
    }

    function importLuckyNumbers(
        uint256 id,
        string[] memory luckyNumbers
    ) public {
        require(lotteries[id].owner == msg.sender, "Unauthorized entity");
        require(luckyNumbers.length > 0, "Lucky numbers cannot be zero");
        /** 用于检查指定彩票ID的幸运数字数组长度是否小于1。如果长度小于1，表示还没有生成幸运数字，可以继续生成操作。 */
        require(lotteryLuckyNumbers[id].length < 1, "Already generated");

        lotteryLuckyNumbers[id] = luckyNumbers;
    }

    function buyTicket(uint256 id, uint256 luckyNumberId) public payable {
        require(
            !luckyNumberUsed[id][luckyNumberId],
            "Lucky number already used"
        );
        require(
            msg.value >= lotteries[id].ticketPrice,
            "insufficient ethers to buy tickets"
        );

        lotteries[id].participants++;
        lotteryParticipants[id].push(
            ParticipantsStruct(
                msg.sender,
                lotteryLuckyNumbers[id][luckyNumberId],
                false
            )
        );
        luckyNumberUsed[id][luckyNumberId] = true;
        serviceBalance += msg.value;
    }

    function randomSlectWinners(uint256 id, uint256 numOfWinners) public {
        /**指定彩票(lotteries[id])的所有者, 合约的所有者(owner()函数返回的地址) */
        require(
            lotteries[id].owner == msg.sender || msg.sender == owner(),
            "Unauthorized entity"
        );
        require(
            !lotteryResult[id].completed,
            "Lottery have already been completed"
        );
        require(
            numOfWinners <= lotteryParticipants[id].length,
            "Number of winners exceeds number of participants"
        );

        // Intialize an array to store the selected winners
        ParticipantsStruct[] memory winners = new ParticipantsStruct[](
            numOfWinners
        );
        ParticipantsStruct[] memory participants = lotteryParticipants[id];
        // lotteryParticipants[id]可以获取到指定彩票活动 id 的所有参与者数据

        // 初始化索引列表的值为0,1，…，n-1
        uint256[] memory indices = new uint256[](participants.length);

        for (uint256 i = 0; i < participants.length; i++) {
            indices[i] = i;
        }

        // 使用Fisher-Yates算法对索引列表进行洗牌
        for (uint256 i = participants.length - 1; i >= 1; i--) {
            // 生成伪随机数
            uint256 j = uint256(keccak256(abi.encodePacked(currentTime(), i))) %
                (i + 1);
            uint256 temp = indices[j];
            indices[j] = indices[i];
            indices[i] = temp;
        }

        // 使用第一个nummofwinners索引选择获胜者
        // numOfWinners是获奖者的数量
        // 从参与者数组中根据索引数组提取获奖者的地址，
        // 并将这些地址添加到 lotteryResult 数组中对应的 winners 数组中
        for (uint256 i = 0; i < numOfWinners; i++) {
            winners[i] = participants[indices[i]];
            lotteryResult[id].winners.push(winners[i]);
        }

        lotteryResult[id].completed = true;
        lotteryResult[id].timestamp = currentTime();
        // lotteryResult[id].winners = lotteryResult[id].winners.length;
        lotteries[id].drawn = true;

        payLotteryWinners(id);
    }

    // 遍历 winners 数组,并向每个获奖者支付相应的奖金
    function payLotteryWinners(uint id) internal {
        ParticipantsStruct[] memory winners = lotteryResult[id].winners;
        uint256 totalShares = lotteries[id].ticketPrice *
            lotteryParticipants[id].length;
        uint256 platformShare = (totalShares * servicePercent) / 100;
        uint256 netShare = totalShares - platformShare;
        uint256 sharesPerWinner = netShare / winners.length;

        for (uint256 i = 0; i < winners.length; i++) {
            payTo(winners[i].account, sharesPerWinner);
        }

        payTo(owner(), platformShare);
        serviceBalance -= totalShares;
        lotteryResult[id].paidout = true;
        lotteryResult[id].sharePerWinner = sharesPerWinner;
    }

    // 返回所有的已创建的彩票活动信息
    function getLotteries()
        public
        view
        returns (LotteryStruct[] memory Lotteries)
    {
        // _totalLotteries.current()是当前值，已创建彩票活动总数
        Lotteries = new LotteryStruct[](_totalLotteries.current());

        for (uint256 i = 1; i < _totalLotteries.current(); i++) {
            Lotteries[i - 1] = lotteries[i];
        }
    }

    // 返回单个彩票
    function getLottery(uint256 id) public view returns (LotteryStruct memory) {
        return lotteries[id];
    }

    // 返回指定彩票活动 ID 的所有参与者信息
    function getLotteryParticipants(
        uint256 id
    ) public view returns (ParticipantsStruct[] memory) {
        return lotteryParticipants[id];
    }

    // 通过该 ID 可以在映射中查找对应的中奖号码列表
    function getLotteryLuckyNumbers(
        uint256 id
    ) public view returns (string[] memory) {
        return lotteryLuckyNumbers[id];
    }

    function getLotteryResult(
        uint256 id
    ) public view returns (LotteryResultStruct memory) {
        return lotteryResult[id];
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success, "Send failed");
    }

    function currentTime() internal view returns (uint256) {
        uint256 newNum = (block.timestamp * 1000) + 1000;
        return newNum;
    }
}
