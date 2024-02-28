import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import rootReducer from "../slices/rootReducer";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// ...
const _combined = combineReducers(rootReducer); 
const persistConfig = {
  key: "CrewFareAdmin",
  storage,
  version: 1,
};

//Middlewares
const persistedReducer = persistReducer(
  persistConfig,
  _combined
) as unknown as typeof _combined;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
  ],
  devTools: process.env.NODE_ENV === "development"
});



// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
