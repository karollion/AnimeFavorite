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

export const getAnimeSearchResults = state => state.animes.searchResults
export const getAnimeSearchLoading = state => state.animes.searchLoading
export const getAnimeSearchError = state => state.animes.searchError

export const getAnimeStats = state => state.animes.stats
export const getAnimeStatsLoading = state => state.animes.statsLoading
export const getAnimeStatsError = state => state.animes.statsError

export const getUserAnimeRelation = state => state.animes.userAnimeRelation
export const getUserAnimeAnimeId = state => state.animes.userAnimeAnimeId
export const getUserAnimeLoading = state => state.animes.userAnimeLoading
export const getUserAnimeError = state => state.animes.userAnimeError

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

const SEARCH_ANIME_START = createActionName('SEARCH_START')
const SEARCH_ANIME_SUCCESS = createActionName('SEARCH_SUCCESS')
const SEARCH_ANIME_ERROR = createActionName('SEARCH_ERROR')
const CLEAR_ANIME_SEARCH = createActionName('SEARCH_CLEAR')

const ANIME_STATS_START = createActionName('STATS_START')
const ANIME_STATS_SUCCESS = createActionName('STATS_SUCCESS')
const ANIME_STATS_ERROR = createActionName('STATS_ERROR')
const CLEAR_ANIME_STATS = createActionName('STATS_CLEAR')

const USER_ANIME_FETCH_START = createActionName('USER_ANIME_FETCH_START')
const USER_ANIME_FETCH_SUCCESS = createActionName('USER_ANIME_FETCH_SUCCESS')
const USER_ANIME_FETCH_ERROR = createActionName('USER_ANIME_FETCH_ERROR')
const USER_ANIME_SAVE_START = createActionName('USER_ANIME_SAVE_START')
const USER_ANIME_SAVE_SUCCESS = createActionName('USER_ANIME_SAVE_SUCCESS')
const USER_ANIME_SAVE_ERROR = createActionName('USER_ANIME_SAVE_ERROR')
const USER_ANIME_CLEAR = createActionName('USER_ANIME_CLEAR')

/* =====================================================
   ACTION CREATORS
   ===================================================== */

export const fetchStart = () => ({ type: FETCH_START })
export const fetchSuccess = payload => ({ type: FETCH_SUCCESS, payload })
export const fetchError = payload => ({ type: FETCH_ERROR, payload })

export const addAnime = payload => ({ type: ADD_ANIME, payload })
export const updateAnime = payload => ({ type: UPDATE_ANIME, payload })
export const removeAnime = payload => ({ type: REMOVE_ANIME, payload })

export const searchAnimeStart = () => ({type: SEARCH_ANIME_START})
export const searchAnimeSuccess = payload => ({type: SEARCH_ANIME_SUCCESS, payload})
export const searchAnimeError = payload => ({type: SEARCH_ANIME_ERROR, payload})
export const clearAnimeSearch = () => ({type: CLEAR_ANIME_SEARCH})

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

export const addAnimeRequest = (anime) => async dispatch => {
  try {
    const res = await api.post('/animes', anime);

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

    // Aktualizacja statystyk po udanym zapisie.
    dispatch(fetchAnimeStats(_id));
    return res.data;
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message));
    throw err;
  }
};

export const updateAnimeCoverRequest = (id, cover) => async dispatch => {
  try {
    const formData = new FormData();

    // Nazwa musi odpowiadać upload("anime_covers").single("cover").
    formData.append('cover', cover);

    const res = await api.put(
      `/animes/${id}/cover`,
      formData
    );

    dispatch(updateAnime(res.data));

    return res.data;
  } catch (err) {
    dispatch(fetchError(
      err.response?.data?.message || err.message
    ));

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
   THUNK — SEARCH ANIME
   ===================================================== */

/**
 * @function searchAnimeRequest
 * @description Searches anime by title for Navbar autocomplete.
 *
 * @param {string} search - Search phrase entered by the user.
 */
export const searchAnimeRequest = search => async dispatch => {
  const normalizedSearch = search.trim();

  if (normalizedSearch.length < 2) {
    dispatch(clearAnimeSearch());
    return [];
  }

  dispatch(searchAnimeStart());

  try {
    const res = await api.get('/animes/search', {
      params: { search: normalizedSearch }
    });

    dispatch(searchAnimeSuccess(res.data));

    return res.data;
  } catch (err) {
    dispatch(searchAnimeError(
      err.response?.data?.message || err.message
    ));

    throw err;
  }
};

/* =====================================================
   THUNK — ANIME COMMUNITY STATISTICS
   ===================================================== */

/**
 * @function fetchAnimeStats
 * @description Fetches community statistics for a specific anime.
 *
 * @param {string} animeId - MongoDB ID of the anime.
 * @returns {Function} Redux thunk.
 */
export const fetchAnimeStats = animeId => async dispatch => {
  if (!animeId) return

  dispatch({ type: ANIME_STATS_START })

  try {
    const res = await api.get(`/user-anime/stats/${animeId}`)

    dispatch({
      type: ANIME_STATS_SUCCESS,
      payload: {
        animeId,
        stats: res.data,
      },
    })

    return res.data
  } catch (err) {
    dispatch({
      type: ANIME_STATS_ERROR,
      payload: err.response?.data?.message || err.message,
    })

    throw err
  }
}

export const clearAnimeStats = () => ({
  type: CLEAR_ANIME_STATS,
})

/* =====================================================
   THUNKS — USER ANIME RELATION
   ===================================================== */

/**
 * Fetches the authenticated user's relation with a specific anime.
 * Uses the existing /user-anime/me endpoint.
 */
export const fetchUserAnimeRelation = animeId => async dispatch => {
  if (!animeId) return

  dispatch({
    type: USER_ANIME_FETCH_START,
    payload: animeId,
  })

  try {
    const res = await api.get('/user-anime/me')

    const relation = res.data.find(entry =>
      String(entry.anime?._id || entry.anime) === String(animeId)
    ) || null

    dispatch({
      type: USER_ANIME_FETCH_SUCCESS,
      payload: { animeId, relation },
    })

    return relation
  } catch (err) {
    dispatch({
      type: USER_ANIME_FETCH_ERROR,
      payload: err.response?.data?.message || err.message,
    })

    throw err
  }
}

/**
 * Creates or updates the authenticated user's anime relation.
 * Refreshes community statistics after a successful save.
 */
export const saveUserAnimeRelation = (animeId, changes) => async dispatch => {
  if (!animeId) return

  dispatch({ type: USER_ANIME_SAVE_START })

  try {
    const res = await api.post('/user-anime', {
      anime: animeId,
      ...changes,
    })

    dispatch({
      type: USER_ANIME_SAVE_SUCCESS,
      payload: {
        animeId,
        relation: res.data,
      },
    })

    // Refresh community statistics after the database update.
    dispatch(fetchAnimeStats(animeId)).catch(() => {})

    return res.data
  } catch (err) {
    dispatch({
      type: USER_ANIME_SAVE_ERROR,
      payload: err.response?.data?.message || err.message,
    })

    throw err
  }
}

/**
 * Clears the selected user's anime relation from Redux.
 * Used when the user logs out.
 */
export const clearUserAnimeRelation = () => ({
  type: USER_ANIME_CLEAR,
})

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
  error: null,
  searchResults: [],
  searchLoading: false,
  searchError: null,
  stats: null,
  statsAnimeId: null,
  statsLoading: false,
  statsError: null,
  userAnimeRelation: null,
  userAnimeAnimeId: null,
  userAnimeLoading: false,
  userAnimeError: null,
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
    
    case SEARCH_ANIME_START:
      return {
        ...state,
        searchLoading: true,
        searchError: null
      }
    
    case SEARCH_ANIME_SUCCESS:
      return {
        ...state,
        searchLoading: false,
        searchResults: action.payload,
        searchError: null
      }
    
    case SEARCH_ANIME_ERROR:
      return {
        ...state,
        searchLoading: false,
        searchResults: [],
        searchError: action.payload
      }
    
    case CLEAR_ANIME_SEARCH:
      return {
        ...state,
        searchResults: [],
        searchLoading: false,
        searchError: null
      }

    case ANIME_STATS_START:
      return {
        ...state,
        statsLoading: true,
        statsError: null,
      }
    
    case ANIME_STATS_SUCCESS:
      return {
        ...state,
        statsLoading: false,
        statsError: null,
        stats: action.payload.stats,
        statsAnimeId: action.payload.animeId,
      }
    
    case ANIME_STATS_ERROR:
      return {
        ...state,
        statsLoading: false,
        statsError: action.payload,
      }
    
    case CLEAR_ANIME_STATS:
      return {
        ...state,
        stats: null,
        statsAnimeId: null,
        statsLoading: false,
        statsError: null,
      }

    case USER_ANIME_FETCH_START:
      return {
        ...state,
        userAnimeRelation: null,
        userAnimeAnimeId: action.payload,
        userAnimeLoading: true,
        userAnimeError: null,
      }
    
    case USER_ANIME_FETCH_SUCCESS:
      return {
        ...state,
        userAnimeRelation: action.payload.relation,
        userAnimeAnimeId: action.payload.animeId,
        userAnimeLoading: false,
        userAnimeError: null,
      }
    
    case USER_ANIME_FETCH_ERROR:
      return {
        ...state,
        userAnimeLoading: false,
        userAnimeError: action.payload,
      }
    
    case USER_ANIME_SAVE_START:
      return {
        ...state,
        userAnimeLoading: true,
        userAnimeError: null,
      }
    
    case USER_ANIME_SAVE_SUCCESS:
      return {
        ...state,
        userAnimeRelation: action.payload.relation,
        userAnimeAnimeId: action.payload.animeId,
        userAnimeLoading: false,
        userAnimeError: null,
      }
    
    case USER_ANIME_SAVE_ERROR:
      return {
        ...state,
        userAnimeLoading: false,
        userAnimeError: action.payload,
      }
    
    case USER_ANIME_CLEAR:
      return {
        ...state,
        userAnimeRelation: null,
        userAnimeAnimeId: null,
        userAnimeLoading: false,
        userAnimeError: null,
      }

    default:
      return state
  }
}

export default animesReducer