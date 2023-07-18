import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Electeur, TypeElecteur } from "../models/Electeur";

// Define a type for the slice state
interface TypeStateSlice {
  value: boolean;
}

// Define the initial state using that type
const initialState: TypeStateSlice = {
  value: true,
};

export const loadDataElecteurSlice = createSlice({
  name: "load_electeur",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loadElecteurs: (state) => {
      state.value = true
    },
    blockLoadElecteurs: (state) => {
      state.value = false;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    // addElecteurByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const { loadElecteurs, blockLoadElecteurs } = loadDataElecteurSlice.actions;

export default loadDataElecteurSlice.reducer;
