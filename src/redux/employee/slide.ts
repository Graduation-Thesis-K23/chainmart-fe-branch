import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ASYNC_STATUS } from "../constants";
import instance from "~/services/axios-instance";
import { AppDispatch, RootState } from "../store";
import { EmployeeType, ErrorPayload } from "~/shared";

export interface MoreEmployeeType {
  name: string;
  phone: string;
}

export type MoreEmployeePayload = Omit<EmployeeType, "id" | "createAt">;

export interface EmployeesState {
  data: EmployeeType[];
  status: typeof ASYNC_STATUS[keyof typeof ASYNC_STATUS];
}

const initialState: EmployeesState = {
  data: [],
  status: ASYNC_STATUS.IDLE,
};

const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();

export const employeesState = createSlice({
  name: "employees",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(fetchEmployees.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEED;
      state.data = payload;
    });
    builder.addCase(fetchEmployees.rejected, (state) => {
      state.status = ASYNC_STATUS.FAILED;
    });
    builder.addCase(createEmployee.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(createEmployee.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEED;
      state.data = [...state.data, payload];
    });
    builder.addCase(createEmployee.rejected, (state) => {
      state.status = ASYNC_STATUS.SUCCEED;
    });
    builder.addCase(activeEmployee.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(activeEmployee.fulfilled, (state, { payload }) => {
      state.status = ASYNC_STATUS.SUCCEED;
      state.data = state.data.map((employee) =>
        employee.phone === payload.phone ? payload : employee
      );
    });
    builder.addCase(activeEmployee.rejected, (state) => {
      state.status = ASYNC_STATUS.FAILED;
    });
  },
});

export const fetchEmployees = createAppAsyncThunk(
  "employee/fetchEmployees",
  async (_, thunkApi) => {
    const response: EmployeeType[] | ErrorPayload = await instance.get(
      "/api/employee/manager"
    );

    if ("message" in response) {
      return thunkApi.rejectWithValue(response.message as unknown as string);
    }

    return thunkApi.fulfillWithValue(response as unknown as EmployeeType[]);
  }
);

export const createEmployee = createAppAsyncThunk(
  "employee/createEmployee",
  async (data: MoreEmployeeType, thunkApi) => {
    const response: EmployeeType | ErrorPayload = await instance.post(
      "/api/employee/create-employee",
      data
    );

    if ("message" in response) {
      return thunkApi.rejectWithValue(response.message as unknown as string);
    }

    return thunkApi.fulfillWithValue(response as unknown as EmployeeType);
  }
);

export const activeEmployee = createAppAsyncThunk(
  "employee/activeEmployee",
  async (data: { phone: string; active: boolean }, thunkApi) => {
    const response: EmployeeType | ErrorPayload = await instance.get(
      "/api/employee/active-employee/" + data.phone + "?active=" + data.active
    );

    if ("message" in response) {
      return thunkApi.rejectWithValue(response.message as unknown as string);
    }

    return thunkApi.fulfillWithValue(response as unknown as EmployeeType);
  }
);

export const resetPassword = createAppAsyncThunk(
  "employee/resetPassword",
  async (id: string, thunkApi) => {
    const response: EmployeeType | ErrorPayload = await instance.get(
      "/api/employee/reset-password-manager/" + id
    );

    if ("message" in response) {
      return thunkApi.rejectWithValue(response.message as unknown as string);
    }

    return thunkApi.fulfillWithValue(response as unknown as EmployeeType);
  }
);

export default employeesState.reducer;
