export function generateLottery(id) {
  const image = '/bitcoin.svg'
  const expiresIn = getRandomInt(7, 30)
  const expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000).getTime()
  const drawsAt = getRandomTimestamp(
    new Date('2024-01-01').getTime(),
    new Date('2024-12-31').getTime()
  )

  return {
    id,
    title: `Lottery ${id}`,
    description: `This is the Lottery`,
    owner: generateRandomEthereumAddress(),
    prize: getRandomFloat(10, 100).toFixed(2),
    ticketPrice: getRandomFloat(0.01, 0.1).toFixed(2),
    image,
    createAt: getRandomTimestamp(
      new Date('2024-01-01').getTime(),
      new Date('2024-12-30').getTime()
    ),
    drawsAt,
    expiresAt,
    participants: getRandomInt(10, 100),
    drawn: false,
  }
}

export const generateLotteries = (n) => {
  const lotteris = []

  for (let i = 1; i <= n; i++) {
    const id = i.toString()
    const title = `Lottery ${id}`
    const description = `This is the ${i} lottery`
    const owner = generateRandomEthereumAddress()
    const prize = getRandomFloat(10, 100).toFixed(2)
    const ticketPrice = getRandomFloat(0.01, 0.1).toFixed(2)
    const image = '/bitcoin.svg'
    const createAt = getRandomTimestamp(
      new Date('2024-01-01').getTime(),
      new Date('2024-12-31').getTime()
    )
    const drawsAt = getRandomTimestamp(
      new Date('2024-01-01').getTime(),
      new Date('2024-12-31').getTime()
    )
    const expiresIn = getRandomInt(7, 30)
    const expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000).getTime()
    const participants = getRandomInt(10, 100)
    const drawn = false

    lotteris.push({
      id,
      title,
      description,
      owner,
      prize,
      ticketPrice,
      image,
      createAt,
      drawsAt,
      expiresAt,
      participants,
      drawn,
    })
  }
  return lotteris
}

export function generateLotteryParticipants(count) {
  const participants = []
  const accounts = ['0x21eA0d82359AB54883aeB601cBC34990b52CfDaB']
  for (let i = 0; i < count; i++) {
    const participant = {
      account: accounts[0],
      lotteryNumber: Math.random().toString(36).substring(2, 8),
      paid: false,
    }
    participants.push(participant)
  }
  return participants
}

export function getPurchaseNumbers(length) {
  const charaters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789'
  const result = []
  for (let i = 0; i < length; i++) {
    let str = ''
    for (let j = 0; j < 6; j++) {
      str += charaters.charAt(Math.floor(Math.random() * charaters.length))
    }
    result.push(str)
  }
  return result
}

function generateRandomEthereumAddress() {
  const hexChars = '0123456789abcdef'
  let address = '0x'

  for (let i = 0; i < 40; i++) {
    address += hexChars.charAt(Math.floor(Math.random() * hexChars.length))
  }
  return address
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomTimestamp(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
