import { createSlice } from '@reduxjs/toolkit';

// Clear localStorage on app load to require login
if (typeof window !== 'undefined') {
  localStorage.clear();
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    }
  }
});
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;