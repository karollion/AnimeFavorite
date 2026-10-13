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

    dispatch(fetchSuccess(res.data))
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message))
  }
}

export const fetchAnimeBySlug = slug => async dispatch => {
  dispatch(fetchStart())

  try {
    const res = await api.get('/animes/slug/' + slug)

    dispatch({ type: FETCH_ONE_SUCCESS, payload: res.data }) 
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message))
  }
}

const createAnimeFormData = (anime, cover) => {
  const formData = new FormData();

  Object.entries(anime).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  if (cover) {
    formData.append('anime_cover', cover);
  }

  return formData;
};

export const addAnimeRequest = (anime) => async dispatch => {
  try {
    //const formData = createAnimeFormData(anime);
    const formData = anime;
    const res = await api.post('/animes', formData);

    dispatch(addAnime(res.data));
    return res.data;
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message));
    throw err;
  }
};

export const updateAnimeRequest = anime => async dispatch => {
  try {
    const { _id, ...updates } = anime;

    const res = await api.put(`/animes/${_id}`, updates);

    dispatch(updateAnime(res.data));
    return res.data;
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message));
    throw err;
  }
};

export const updateAnimeCoverRequest = (id, cover) => async dispatch => {
  try {
    const formData = new FormData();
    formData.append('anime_cover', cover);

    const res = await api.put(
      `/animes/${id}/cover`,
      formData
    );

    dispatch(updateAnime(res.data));
    return res.data;
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message));
    throw err;
  }
};

export const removeAnimeRequest = anime => async dispatch => {
  try {
    const res = await api.delete(`/animes/${anime._id}`)
    dispatch(removeAnime(res.data))
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message))
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