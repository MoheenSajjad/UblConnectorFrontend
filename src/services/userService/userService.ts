import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, defaultPageSize } from "@/config";
import { User as UserRecord } from "@/types/user";
import { User } from "../config/endpoints/endpoints";

export const GetAllUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    {
      pageNumber = 1,
      pageSize = defaultPageSize,
    }: { pageNumber?: number; pageSize?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await User.GetAllUsers({ pageNumber, pageSize });
      if (response.data.responseCode !== 200) {
        throw new Error(response.data.message || "Failed to fetch users");
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GetUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await User.GetUserById(id);
      if (response.data.responseCode !== 200) {
        throw new Error(response.data.message || "Failed to fetch user");
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const CreateUser = createAsyncThunk(
  "users/createUser",
  async (user: Omit<UserRecord, "id" | "createdAt">, { rejectWithValue }) => {
    try {
      const response = await User.CreateUser(user);
      if (response.data.responseCode !== 200) {
        throw new Error(response.data.message || "Failed to create user");
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const UpdateUser = createAsyncThunk(
  "users/updateUser",
  async (user: Omit<UserRecord, "createdAt">, { rejectWithValue }) => {
    try {
      const response = await User.UpdateUser({ id: user.id, user });
      if (response.data.responseCode !== 200) {
        throw new Error(response.data.message || "Failed to update user");
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const DeleteUser = createAsyncThunk(
  "users/deleteUser",
  async (
    { id, isDelete }: { id: string; isDelete: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await User.DeleteUser(id, isDelete);
      if (response.data.responseCode !== 200) {
        throw new Error(response.data.message || "Failed to delete user");
      }
      return { id, isDelete };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
