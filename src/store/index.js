import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // Kết nối authSlice vào kho lưu trữ với tên là "auth"
  },
});

export default store;