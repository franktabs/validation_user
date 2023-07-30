import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Electeur, TypeElecteur } from "../models/Electeur";

// Define a type for the slice state
interface TypeStateSlice {
  value: boolean;
}

// Define the initial state using that type
const initialState: TypeStateSlice = {
  value: false,
};

export const connectedSlice = createSlice({
  name: "connected_electeur",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    connected: (state) => {
      state.value = true;
    },
    deconnected: (state) => {
      state.value = false;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    // addElecteurByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const { connected, deconnected } =
  connectedSlice.actions;

export default connectedSlice.reducer;
