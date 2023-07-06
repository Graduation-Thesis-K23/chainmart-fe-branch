import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ASYNC_STATUS } from "../constants";
import { BatchType, ErrorPayload } from "~/shared";
import instance from "~/services/axios-instance";

export interface BatchState {
  data: BatchType[];
  status: typeof ASYNC_STATUS[keyof typeof ASYNC_STATUS];
}

export interface BatchPayload {
  product_id: string;
  import_quantity: number;
  import_cost: number;
  acceptable_expiry_threshold: number;
  expiry_date: string;
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
    builder.addCase(createBatch.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(createBatch.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEED;
      state.data.push(payload);
    });
    builder.addCase(createBatch.rejected, (state) => {
      state.status = ASYNC_STATUS.FAILED;
    });
  },
});

export const fetchBatch = createAsyncThunk(
  "batch/fetchBatch",
  async (_, thunkApi) => {
    const response: BatchType[] | ErrorPayload = await instance.get(
      "/api/batches"
    );

    if ("message" in response) {
      return thunkApi.rejectWithValue(response);
    }

    return thunkApi.fulfillWithValue(response);
  }
);

export const createBatch = createAsyncThunk(
  "batch/createBatch",
  async (payload: BatchPayload, thunkApi) => {
    const response: BatchType | ErrorPayload = await instance.post(
      "/api/batches",
      {
        ...payload,
        branch_id: "115cb7a8-78db-4dd1-b3dc-2e3dfba95338",
        employee_create_id: "46ae3cbf-efba-4d7a-b731-cd4d2a50e033",
      }
    );

    if ("message" in response) {
      return thunkApi.rejectWithValue(response);
    }

    return thunkApi.fulfillWithValue(response);
  }
);

export default batchState.reducer;
