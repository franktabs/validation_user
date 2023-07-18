import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Electeur, TypeElecteur } from "../models/Electeur";

// Define a type for the slice state
interface ElecteurState {
  electeur?: TypeElecteur | null
}

// Define the initial state using that type
const initialState: ElecteurState = {
  electeur: null,
};

export const electeurSlice = createSlice({
  name: "electeur",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addElecteur: (state, action: PayloadAction<typeof Electeur.clearData>) => {
      state.electeur = action.payload;
    },
    deleteElecteur: (state) => {
      state.electeur = null;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    // addElecteurByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const { addElecteur, deleteElecteur } = electeurSlice.actions;

export default electeurSlice.reducer;
