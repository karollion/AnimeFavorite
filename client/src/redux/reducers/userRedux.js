import { API_URL } from '../../config'

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
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS')
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
  dispatch(fetchStart())

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message)

    dispatch(loginSuccess(data))
  } catch (err) {
    dispatch(fetchError(err.message))
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logoutRequest = () => async dispatch => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })

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
  dispatch(fetchStart())

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include'
    })

    if (res.status === 401) {
      dispatch(logoutUser())
      return
    }

    const data = await res.json()
    dispatch(loginSuccess(data))
  } catch (err) {
    dispatch(fetchError(err.message))
  }
}

/* =====================================================
   THUNKS — USER PROFILE
   ===================================================== */

/**
 * Update profile fields
 * PUT /api/auth/me
 */
export const updateProfileRequest = updates => async dispatch => {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates)
    })

    const data = await res.json()
    dispatch(updateProfileSuccess(data))
  } catch (err) {
    dispatch(fetchError(err.message))
  }
}

/**
 * Upload avatar
 * PUT /api/auth/me/avatar
 */
export const updateAvatarRequest = file => async dispatch => {
  try {
    const formData = new FormData()
    formData.append('avatar', file)

    const res = await fetch(`${API_URL}/auth/me/avatar`, {
      method: 'PUT',
      credentials: 'include',
      body: formData
    })

    const data = await res.json()
    dispatch(updateAvatarSuccess(data))
  } catch (err) {
    dispatch(fetchError(err.message))
  }
}

/**
 * Fetch user stats
 * GET /api/auth/me/stats
 */
export const fetchUserStats = () => async dispatch => {
  try {
    const res = await fetch(`${API_URL}/auth/me/stats`, {
      credentials: 'include'
    })

    const data = await res.json()
    dispatch(setStats(data))
  } catch (err) {
    dispatch(fetchError(err.message))
  }
}

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