import { API_URL } from '../../config'

// ================= SELECTORS =================
export const getAllAnimes = ({ animes }) => animes.data
export const getAnimesLoading = ({ animes }) => animes.loading
export const getAnimesError = ({ animes }) => animes.error

export const getAnimeById = ({ animes }, id) =>
  animes.data.find(anime => anime._id === id)

export const getAnimeBySlug = ({ animes }, slug) =>
  animes.data.find(anime => anime.slug === slug)

// ================= ACTION TYPES =================
const createActionName = name => `app/animes/${name}`

const FETCH_START = createActionName('FETCH_START')
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS')
const FETCH_ERROR = createActionName('FETCH_ERROR')

const ADD_ANIME = createActionName('ADD')
const UPDATE_ANIME = createActionName('UPDATE')
const REMOVE_ANIME = createActionName('REMOVE')

// ================= ACTION CREATORS =================
export const fetchStart = () => ({ type: FETCH_START })
export const fetchSuccess = payload => ({ type: FETCH_SUCCESS, payload })
export const fetchError = payload => ({ type: FETCH_ERROR, payload })

export const addAnime = payload => ({ type: ADD_ANIME, payload })
export const updateAnime = payload => ({ type: UPDATE_ANIME, payload })
export const removeAnime = payload => ({ type: REMOVE_ANIME, payload })

// ================= THUNKS =================
export const fetchAnimes = () => async dispatch => {
  dispatch(fetchStart())
  try {
    const res = await fetch(`${API_URL}/animes`)
    const data = await res.json()
    dispatch(fetchSuccess(data))
  } catch (err) {
    dispatch(fetchError(err.message))
  }
}

export const addAnimeRequest = anime => async dispatch => {
  try {
    const res = await fetch(`${API_URL}/animes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anime),
      credentials: 'include'
    })
    const data = await res.json()
    dispatch(addAnime(data))
  } catch (err) {
    dispatch(fetchError(err.message))
  }
}

export const updateAnimeRequest = anime => async dispatch => {
  try {
    await fetch(`${API_URL}/animes/${anime._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anime),
      credentials: 'include'
    })
    dispatch(updateAnime(anime))
  } catch (err) {
    dispatch(fetchError(err.message))
  }
}

export const removeAnimeRequest = id => async dispatch => {
  try {
    await fetch(`${API_URL}/animes/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    dispatch(removeAnime(id))
  } catch (err) {
    dispatch(fetchError(err.message))
  }
}

// ================= INITIAL STATE =================
const initialState = {
  data: [],
  loading: false,
  error: null
}

// ================= REDUCER =================
const animesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_START:
      return { ...state, loading: true, error: null }

    case FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload }

    case FETCH_ERROR:
      return { ...state, loading: false, error: action.payload }

    case ADD_ANIME:
      return { ...state, data: [...state.data, action.payload] }

    case UPDATE_ANIME:
      return {
        ...state,
        data: state.data.map(anime =>
          anime._id === action.payload._id
            ? { ...anime, ...action.payload }
            : anime
        )
      }

    case REMOVE_ANIME:
      return {
        ...state,
        data: state.data.filter(anime => anime._id !== action.payload)
      }

    default:
      return state
  }
}

export default animesReducer