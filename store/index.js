import { configureStore } from "@reduxjs/toolkit";
import globalSlices from "./globalSlices";
console.log("globalSlices--->", globalSlices);
export const store = configureStore({
  reducer: {
    globalState: globalSlices,
  },
});
