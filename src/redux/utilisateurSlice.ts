import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUtilisateur, Utilisateur } from "../models/Utilisateur";

// Define a type for the slice state
type UtilisateurState = {value: IUtilisateur, gerer:boolean};

// Define the initial state using that type
const initialState: UtilisateurState = {value:Utilisateur.clearData, gerer:false};

export const utilisateurSlice = createSlice({
    name: "utilisateur",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        gererUtilisateur: (state, action: PayloadAction<UtilisateurState>) => {
            state.gerer = action.payload.gerer;
            state.value = action.payload.value 
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        // addElecteurByAmount: (state, action: PayloadAction<number>) => {
        //   state.value += action.payload;
        // },
    },
});

export const { gererUtilisateur } = utilisateurSlice.actions;

export default utilisateurSlice.reducer;
