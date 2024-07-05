import { createSlice } from "@reduxjs/toolkit";
import { globalActions as GlobalActions } from "./actions/globalActions";
import { globalState as GlobalState } from "./states/globalState";

export const globalSlice = createSlice({
  name: "global",
  initialState: GlobalState,
  reducers: GlobalActions,
});

export const globalActions = globalSlice.actions;
export default globalSlice.reducer;
