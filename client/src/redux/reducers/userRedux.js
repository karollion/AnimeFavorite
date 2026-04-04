import { API_URL } from '../../config';
import api from "../../utils/axios"
/* =====================================================
   USER REDUX
   ===================================================== */

/**
 * @file userRedux.js
 * @description Redux state responsible for:
 * - authentication
 * - user profile
 * - user statistics
 * - avatar updates
 *
 * Works with session-based authentication.
 */

/* =====================================================
   SELECTORS
   ===================================================== */

export const getUser = state => state.user.data
export const getUserLoading = state => state.user.loading
export const getUserError = state => state.user.error
export const getUserStats = state => state.user.stats
export const isAuthenticated = state => !!state.user.data

/* =====================================================
   ACTION TYPES
   ===================================================== */

const createActionName = name => `app/user/${name}`

const FETCH_START = createActionName('FETCH_START')
//const FETCH_SUCCESS = createActionName('FETCH_SUCCESS')
const FETCH_ERROR = createActionName('FETCH_ERROR')

const LOGIN_SUCCESS = createActionName('LOGIN_SUCCESS')
const LOGOUT = createActionName('LOGOUT')

const UPDATE_PROFILE = createActionName('UPDATE_PROFILE')
const UPDATE_AVATAR = createActionName('UPDATE_AVATAR')
const SET_STATS = createActionName('SET_STATS')

/* =====================================================
   ACTION CREATORS
   ===================================================== */

export const fetchStart = () => ({ type: FETCH_START })
export const fetchError = payload => ({ type: FETCH_ERROR, payload })

export const loginSuccess = payload => ({
  type: LOGIN_SUCCESS,
  payload
})

export const logoutUser = () => ({ type: LOGOUT })

export const updateProfileSuccess = payload => ({
  type: UPDATE_PROFILE,
  payload
})

export const updateAvatarSuccess = payload => ({
  type: UPDATE_AVATAR,
  payload
})

export const setStats = payload => ({
  type: SET_STATS,
  payload
})

/* =====================================================
   THUNKS — AUTH
   ===================================================== */

/**
 * Login user
 * POST /api/auth/login
 */
export const loginRequest = credentials => async dispatch => {
  dispatch(fetchStart());

  try {
    const res = await api.post('/auth/login', credentials);

    dispatch(loginSuccess(res.data));

    // 🔥 AUTOMATYCZNIE pobierz stats po loginie
    const statsRes = await api.get('/auth/me/stats');
    dispatch(setStats(statsRes.data));

  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || 'Login failed'));
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logoutRequest = () => async dispatch => {
  try {
    await api.post('/auth/logout');

    dispatch(logoutUser())
  } catch (err) {
    dispatch(fetchError(err.message))
  }
}

/**
 * Restore session (important after refresh)
 * GET /api/auth/me
 */
export const fetchProfile = () => async dispatch => {
  dispatch(fetchStart());

  try {
    // 1️⃣ restore user
    const userRes = await api.get('/auth/me');
    dispatch(loginSuccess(userRes.data));

    // 2️⃣ fetch stats AUTOMATYCZNIE
    const statsRes = await api.get('/auth/me/stats');
    dispatch(setStats(statsRes.data));

  } catch (err) {
    dispatch(fetchError(null));
  }
};

/* =====================================================
   THUNKS — USER PROFILE
   ===================================================== */

/**
 * Update profile fields
 * PUT /api/auth/me
 */
export const updateProfileRequest = updates => async dispatch => {
  try {
    const res = await api.put('/auth/me', updates);
    dispatch(updateProfileSuccess(res.data));
  } catch (err) {
    dispatch(fetchError(err.message));
  }
};

/**
 * Upload avatar
 * PUT /api/auth/me/avatar
 */
export const updateAvatarRequest = file => async dispatch => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await api.put('/auth/me/avatar', formData);

    dispatch(updateAvatarSuccess(res.data));
  } catch (err) {
    dispatch(fetchError(err.message));
  }
};

/**
 * Fetch user stats
 * GET /api/auth/me/stats
 */
export const fetchUserStats = () => async dispatch => {
  try {
    const res = await api.get('/auth/me/stats');
    dispatch(setStats(res.data));
  } catch (err) {
    dispatch(fetchError(err.message));
  }
};

/* =====================================================
   INITIAL STATE
   ===================================================== */

const initialState = {
  data: null,
  stats: null,
  loading: false,
  error: null
}

/* =====================================================
   REDUCER
   ===================================================== */

const userReducer = (state = initialState, action) => {
  switch (action.type) {

    case FETCH_START:
      return { ...state, loading: true, error: null }

    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload
      }

    case UPDATE_PROFILE:
    case UPDATE_AVATAR:
      return {
        ...state,
        data: { ...state.data, ...action.payload }
      }

    case SET_STATS:
      return {
        ...state,
        loading: false,
        stats: action.payload
      }

    case FETCH_ERROR:
      return { ...state, loading: false, error: action.payload }

    case LOGOUT:
      return initialState

    default:
      return state
  }
}

export default userReducer