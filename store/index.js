import { configureStore } from "@reduxjs/toolkit";
import globalSlices from "./globalSlices";

export const store = configureStore({
  reducer: {
    globalState: globalSlices,
  },
});
