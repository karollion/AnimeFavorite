import { API_URL } from '../../config'
import api from "../../utils/axios";

/* =====================================================
   ANIMES REDUX
   ===================================================== */

/**
 * @file animesRedux.js
 * @description Handles anime collection state:
 * - pagination
 * - fetching lists
 * - single anime view
 * - CRUD operations
 */

/* =====================================================
   SELECTORS
   ===================================================== */

export const getAllAnimes = state => state.animes.list
export const getAnimesLoading = state => state.animes.loading
export const getAnimesError = state => state.animes.error
export const getSelectedAnime = state => state.animes.selected
export const getAnimeById = (state, id) => state.animes.list.find(anime => anime._id === id)
export const getAnimeBySlug = (state, slug) => state.animes.list.find(a => a.slug === slug)
export const getAnimesPage = state => state.animes.page
export const getAnimesTotalPages = state => state.animes.totalPages
export const getAnimesTotalItems = state => state.animes.totalItems

/* =====================================================
   ACTION TYPES
   ===================================================== */

const createActionName = name => `app/animes/${name}`

const FETCH_START = createActionName('FETCH_START')
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS')
const FETCH_ONE_SUCCESS = createActionName('FETCH_ONE_SUCCESS')
const FETCH_ERROR = createActionName('FETCH_ERROR')

const ADD_ANIME = createActionName('ADD')
const UPDATE_ANIME = createActionName('UPDATE')
const REMOVE_ANIME = createActionName('REMOVE')

/* =====================================================
   ACTION CREATORS
   ===================================================== */

export const fetchStart = () => ({ type: FETCH_START })
export const fetchSuccess = payload => ({ type: FETCH_SUCCESS, payload })
export const fetchError = payload => ({ type: FETCH_ERROR, payload })

export const addAnime = payload => ({ type: ADD_ANIME, payload })
export const updateAnime = payload => ({ type: UPDATE_ANIME, payload })
export const removeAnime = payload => ({ type: REMOVE_ANIME, payload })

/* =====================================================
   THUNKS — ANIME
   ===================================================== */


export const fetchAnimes = (page = 1) => async dispatch => {
  dispatch(fetchStart())

  try {
    const res = await api.get('/animes?page=' + page);
    const data = await res.json()

    dispatch(fetchSuccess(data))
  } catch (err) {
    dispatch(fetchError(err.message))
  }
}

export const fetchAnimeBySlug = slug => async dispatch => {
  dispatch(fetchStart())

  try {
    const res = await api.get('/animes/slug/' + slug)

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const data = await res.json()
    dispatch({ type: FETCH_ONE_SUCCESS, payload: data })
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

/* =====================================================
   INITIAL STATE
   ===================================================== */

const initialState = {
  list: [],
  page: 1,
  totalPages: 1,
  totalItems: 0,
  selected: null,
  loading: false,
  error: null
}

/* =====================================================
   REDUCER
   ===================================================== */
   
const animesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_START:
      return { ...state, loading: true, error: null }

    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload.items,
        page: action.payload.page,
        totalPages: action.payload.totalPages,
        totalItems: action.payload.totalItems
      }

    case FETCH_ONE_SUCCESS:
      return { ...state, loading: false, selected: action.payload }

    case FETCH_ERROR:
      return { ...state, loading: false, error: action.payload }

    case ADD_ANIME:
      return { ...state, list: [...state.list, action.payload] }

    case UPDATE_ANIME:
      return {
        ...state,
        list: state.list.map(anime =>
          anime._id === action.payload._id
            ? { ...anime, ...action.payload }
            : anime
        )
      }

    case REMOVE_ANIME:
      return {
        ...state,
        list: state.list.filter(anime => anime._id !== action.payload)
      }

    default:
      return state
  }
}

export default animesReducer