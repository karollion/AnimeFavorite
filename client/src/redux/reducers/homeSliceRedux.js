import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

/* =====================================================
   GET HOME DATA
   ===================================================== */

/**
 * Fetch homepage sections
 *
 * @route GET /api/home
 */
export const fetchHome = createAsyncThunk(
  "home/fetchHome",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/home");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Home fetch failed"
      );
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    newAnimes: [],
    topRated: [],
    animeFilms: [],
    animeTV: [],
    randomAnime: null,

    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchHome.pending, state => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHome.fulfilled, (state, action) => {
        state.loading = false;

        state.newest = action.payload.newest;
        state.topRated = action.payload.topRated;
        state.films = action.payload.films;
        state.tvSeries = action.payload.tvSeries;
        state.random = action.payload.random;
      })

      .addCase(fetchHome.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default homeSlice.reducer;