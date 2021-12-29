import axios from 'axios';
import { createAsyncThunk, createSlice, isPending } from '@reduxjs/toolkit';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  sessions: [],
  updateSuccess: false,
  updateFailure: false,
};

export type SessionsState = Readonly<typeof initialState>;

// Actions
const apiUrl = '/api/account/sessions/';

export const findAll = createAsyncThunk('sessions/find_all', async () => axios.get<any>(apiUrl), {
  serializeError: serializeAxiosError,
});

export const invalidateSession = createAsyncThunk('sessions/invalidate', async (series: any) => axios.delete(`${apiUrl}${series}`), {
  serializeError: serializeAxiosError,
});

export const SessionsSlice = createSlice({
  name: 'sessions',
  initialState: initialState as SessionsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(findAll.rejected, state => {
        state.loading = false;
      })
      .addCase(invalidateSession.rejected, state => {
        state.loading = false;
        state.updateFailure = true;
      })
      .addCase(findAll.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload.data;
      })
      .addCase(invalidateSession.fulfilled, state => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isPending(findAll, invalidateSession), state => {
        state.loading = true;
      });
  },
});

// Reducer
export default SessionsSlice.reducer;
