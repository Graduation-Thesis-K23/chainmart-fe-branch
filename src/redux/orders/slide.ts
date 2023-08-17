import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { ASYNC_STATUS } from "../constants";
import { ErrorPayload, OrderStatus } from "~/shared";
import instance from "~/services/axios-instance";

export interface OrdersType {
  id: string;
  name: string;
  phone: string;
  branchId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
}

export interface OrdersRender extends OrdersType {
  created_at: Date;
  user: User;
  approved_date: Date;
  approved_by: string;
  packaged_date: Date;
  packaged_by: string;
  started_date: Date;
  started_by: string;
  completed_date: Date;
  completed_by: string;
  cancelled_date: Date;
  cancelled_by: string;
  returned_date: Date;
  returned_by: string;
  status: OrderStatus;
  payment: string;
  address: {
    id: string;
    name: string;
    phone: string;
    street: string;
    district: string;
    city: string;
    ward: string;
  };
  order_details: {
    id: string;
    name: string;
    price: number;
    sale: number;
    quantity: number;
    image: string;
  }[];
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
    builder.addCase(approveOrder.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(approveOrder.fulfilled, (state, { payload }) => {
      const { id, status, approved_date } = payload;
      state.status = ASYNC_STATUS.SUCCEED;
      state.data = state.data.map((order) => {
        if (order.id === id) {
          order.status = status;
          order.approved_date = approved_date;
        }
        return order;
      });
    });
    builder.addCase(approveOrder.rejected, (state) => {
      state.status = ASYNC_STATUS.FAILED;
    });
    builder.addCase(rejectOrder.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(rejectOrder.fulfilled, (state, { payload }) => {
      const { id, status, cancelled_date } = payload;
      state.status = ASYNC_STATUS.SUCCEED;
      state.data = state.data.map((order) => {
        if (order.id === id) {
          order.status = status;
          order.cancelled_date = cancelled_date;
        }
        return order;
      });
    });
    builder.addCase(rejectOrder.rejected, (state) => {
      state.status = ASYNC_STATUS.FAILED;
    });
    builder.addCase(beginShipOrder.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(beginShipOrder.fulfilled, (state, { payload }) => {
      const { id, status, started_date } = payload;
      state.status = ASYNC_STATUS.SUCCEED;
      state.data = state.data.map((order) => {
        if (order.id === id) {
          order.status = status;
          order.started_date = started_date;
        }
        return order;
      });
    });
    builder.addCase(beginShipOrder.rejected, (state) => {
      state.status = ASYNC_STATUS.FAILED;
    });
  },
});

export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
  async (
    payload: {
      status: OrderStatus | "all";
      search: string;
    },
    thunkApi
  ) => {
    const response: OrdersRender[] | ErrorPayload = await instance.get(
      "/api/orders/branch",
      {
        params: {
          status: payload.status,
          search: payload.search,
        },
      }
    );

    if ("message" in response) {
      return thunkApi.rejectWithValue(response);
    }

    return thunkApi.fulfillWithValue(response);
  }
);

export const approveOrder = createAsyncThunk(
  "orders/approveOrder",
  async (id: string, thunkApi) => {
    const response: OrdersRender | ErrorPayload = await instance.patch(
      `/api/orders/${id}/approve`
    );

    if ("message" in response) {
      return thunkApi.rejectWithValue(response.message);
    }

    return thunkApi.fulfillWithValue(response);
  }
);

export const rejectOrder = createAsyncThunk(
  "orders/rejectOrder",
  async (id: string, thunkApi) => {
    const response: OrdersRender | ErrorPayload = await instance.patch(
      `/api/orders/${id}/reject`
    );

    if ("message" in response) {
      return thunkApi.rejectWithValue(response.message);
    }

    return thunkApi.fulfillWithValue(response);
  }
);

export const beginShipOrder = createAsyncThunk(
  "orders/beginShipOrder",
  async (id: string, thunkApi) => {
    const response: OrdersRender | ErrorPayload = await instance.patch(
      `/api/orders/${id}/begin-ship`
    );

    if ("message" in response) {
      return thunkApi.rejectWithValue(response.message);
    }

    return thunkApi.fulfillWithValue(response);
  }
);

export default ordersState.reducer;
