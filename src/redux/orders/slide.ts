import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ASYNC_STATUS } from "../constants";
import { OrderType } from "~/shared";

export interface OrderState {
  data: OrderType[];
  status: typeof ASYNC_STATUS[keyof typeof ASYNC_STATUS];
}

const initialState: OrderState = {
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
      state.status = ASYNC_STATUS.SUCCEED;
    });
  },
});

export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (_, thunkApi) => {
    try {
      return thunkApi.fulfillWithValue([
        {
          id: "1",
          status: "pending",
        },
        {
          id: "2",
          status: "pending",
        },
      ] as unknown as OrderType[]);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export default ordersState.reducer;
