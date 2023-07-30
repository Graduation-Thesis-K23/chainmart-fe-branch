import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { loginReducer } from "./login";
import { employeeReducer } from "./employee";
import { ordersReducer } from "./orders";
import { batchReducer } from "./batch";
import { dashboardReducer } from "./dashboard";
import { productReducer } from "./product";

const store = configureStore({
  reducer: {
    login: loginReducer,
    employees: employeeReducer,
    orders: ordersReducer,
    batch: batchReducer,
    dashboard: dashboardReducer,
    products: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
