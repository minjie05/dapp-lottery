export const globalActions = {
  setWallet: (state, action) => {
    state.wallet = action.payload;
  },
  setJackpots: (state, action) => {
    state.jackpots = action.payload;
  },
  setGereratorModal: (state, action) => {
    state.gereratorModal = action.payload;
  },
  setWinnersModal: (state, action) => {
    state.winnersModal = action.payload;
  },
  setLottery: (state, action) => {
    state.jackpot = action.payload;
  },
  setLuckyNumbers: (state, action) => {
    state.luckyNumbers = action.payload;
  },
  setParticipants: (state, action) => {
    state.participants = action.payload;
  },
};
