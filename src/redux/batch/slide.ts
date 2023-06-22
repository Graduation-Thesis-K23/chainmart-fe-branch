import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ASYNC_STATUS } from "../constants";
import { BatchType } from "~/shared";

export interface BatchState {
  data: BatchType[];
  status: typeof ASYNC_STATUS[keyof typeof ASYNC_STATUS];
}

const initialState: BatchState = {
  data: [],
  status: ASYNC_STATUS.IDLE,
};

export const batchState = createSlice({
  name: "batch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBatch.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(fetchBatch.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEED;
      state.data = payload;
    });
    builder.addCase(fetchBatch.rejected, (state) => {
      state.status = ASYNC_STATUS.SUCCEED;
    });
  },
});

export const fetchBatch = createAsyncThunk(
  "batch/fetchBatch",
  async (_, thunkApi) => {
    try {
      return thunkApi.fulfillWithValue([
        {
          id: "1",
          name: "món 1",
        },
        {
          id: "2",
          name: "món 2",
        },
      ] as unknown as BatchType[]);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export default batchState.reducer;
