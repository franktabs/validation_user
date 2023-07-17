import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Electeur } from "../models/Electeur";

// Define a type for the slice state
interface ElecteurState {
  electeurs: Electeur[];
  dataElecteurs:(typeof Electeur.clearData)[]
}

// Define the initial state using that type
const initialState: ElecteurState = {
  electeurs: [],
  dataElecteurs:[]
};

export const electeurSlice = createSlice({
  name: "electeur",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addElecteur: (state, action: PayloadAction<typeof Electeur.clearData>) => {
      state.dataElecteurs.push(action.payload);
    },
    deleteElecteur: (state, action: PayloadAction<number>) => {
      state.dataElecteurs.splice(action.payload, 1);
    },
    reloadElecteurs: (
      state,
      action: PayloadAction<(typeof Electeur.clearData)[]>
    ) => {
      state.dataElecteurs = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    // addElecteurByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const { addElecteur, deleteElecteur, reloadElecteurs } = electeurSlice.actions;

export default electeurSlice.reducer;
