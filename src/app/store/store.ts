// // "use client";
// // import { configureStore } from "@reduxjs/toolkit";

// import counterSlice from "./slices/counterSlice";

// // export const makeStore = configureStore({
// //   reducer: {
// //     counter: counterSlice || {},
// //   },
// // });

// // // Infer the type of makeStore
// // export type AppStore = ReturnType<typeof makeStore>;
// // // Infer the `RootState` and `AppDispatch` types from the store itself
// // export type RootState = ReturnType<AppStore["getState"]>;
// // export type AppDispatch = AppStore["dispatch"];

// // src/store/store.ts
// import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";

// const rootReducer = combineReducers({
//   counter: counterSlice,
// });

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore non-serializable actions
//         ignoredActions: [
//           "persist/PERSIST",
//           "persist/REHYDRATE",
//           "your_non_serializable_action_type",
//         ],
//         ignoredPaths: ["register"], // You can specify other paths to ignore here
//       },
//     }),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
