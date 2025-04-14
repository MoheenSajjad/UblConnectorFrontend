import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types/user";
import {
  GetUserById,
  GetAllUsers,
  DeleteUser,
  UpdateUser,
  CreateUser,
} from "@/services/userService";

interface UserState {
  users: User[];
  user: User | null;
  totalCount: number;
  loading: boolean;
  error: string | null;
  pageNumber: number;
  pageSize: number;
}

const initialState: UserState = {
  users: [],
  user: null,
  totalCount: 0,
  loading: false,
  error: null,
  pageNumber: 1,
  pageSize: 10,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GetAllUsers
      .addCase(GetAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.records;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(GetAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      // GetUserById
      .addCase(GetUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(GetUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user details";
      })

      // CreateUser
      .addCase(CreateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateUser.fulfilled, (state, action) => {
        // state.loading = false;
        // state.users.push(action.payload);
      })
      .addCase(CreateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create user";
      })

      // UpdateUser
      .addCase(UpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateUser.fulfilled, (state, action) => {
        // state.loading = false;
        // const index = state.users.findIndex(
        //   (user) => user.id === action.payload.id
        // );
        // if (index !== -1) {
        //   state.users[index] = action.payload;
        // }
      })
      .addCase(UpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      })

      // DeleteUser
      .addCase(DeleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id
        );
      })
      .addCase(DeleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      });
  },
});

export const { setPageNumber, setPageSize } = userSlice.actions;
export default userSlice.reducer;
