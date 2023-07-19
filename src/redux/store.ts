import { configureStore } from "@reduxjs/toolkit";
import electeurSlice from "./electeurSlice";
import loadDataElecteurSlice from "./loadDataElecteurSlice";
import connectedSlice from "./connectedSlice";
// ...

const store = configureStore({
  reducer: {
    electeur: electeurSlice,
    loadDataElecteurs: loadDataElecteurSlice,
    connectedAdmin: connectedSlice,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
