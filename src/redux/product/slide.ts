import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { ASYNC_STATUS } from "../constants";
import instance from "~/services/axios-instance";
import { ErrorPayload, PaginationMetadata, PaginationResult } from "~/shared";

export interface ProductType {
  id: string;
  name: string;
}
export interface ProductsState {
  data: ProductType[];
  status: typeof ASYNC_STATUS[keyof typeof ASYNC_STATUS];
  metadata: PaginationMetadata;
}

const initialState: ProductsState = {
  data: [],
  status: ASYNC_STATUS.IDLE,
  metadata: {} as PaginationMetadata,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.status = ASYNC_STATUS.LOADING;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.status = ASYNC_STATUS.SUCCEED;
      const { docs, totalDocs, limit, totalPages, page } = action.payload;

      state.data = docs;

      state.metadata = {
        totalDocs,
        limit,
        totalPages,
        page,
      };
    });
    builder.addCase(fetchProducts.rejected, (state) => {
      state.status = ASYNC_STATUS.FAILED;
      state.data = [];
    });
  },
});

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkApi) => {
    const products: PaginationResult<ProductType> | ErrorPayload =
      await instance.get("/api/products?limit=1000000");

    if ("message" in products) {
      return thunkApi.rejectWithValue(products.message);
    }

    return thunkApi.fulfillWithValue(products);
  }
);

export default productsSlice.reducer;
