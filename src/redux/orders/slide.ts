import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ASYNC_STATUS } from "../constants";
import { ErrorPayload, OrderStatus } from "~/shared";
import instance from "~/services/axios-instance";

export interface OrdersRender {
  id: string;
  created_at: string;
  status: OrderStatus;
  total: number;
  payment: string;
  phone: string;
  name: string;
}

export interface OrdersState {
  data: OrdersRender[];
  status: typeof ASYNC_STATUS[keyof typeof ASYNC_STATUS];
}
const initialState: OrdersState = {
  data: [],
  status: ASYNC_STATUS.IDLE,
};

export const ordersState = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrder.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(fetchOrder.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEED;
      state.data = payload;
    });
    builder.addCase(fetchOrder.rejected, (state) => {
      state.status = ASYNC_STATUS.FAILED;
    });
  },
});

export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (_, thunkApi) => {
    const response: OrdersRender[] | ErrorPayload = await instance.get(
      "/api/orders/branch"
    );

    if ("message" in response) {
      return thunkApi.rejectWithValue(response);
    }

    return thunkApi.fulfillWithValue(response);
  }
);

export default ordersState.reducer;
