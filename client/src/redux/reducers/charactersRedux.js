import api from "../../utils/axios";

/* =====================================================
   SELECTORS
   ===================================================== */

export const getAllCharacters = state => state.characters.list;
export const getCharactersLoading = state => state.characters.loading;
export const getCharactersError = state => state.characters.error;
export const getSelectedCharacter = state => state.characters.selected;
export const getCharacterById = (state, id) =>
  state.characters.list.find(c => c._id === id);

/* =====================================================
   ACTION TYPES
   ===================================================== */

const createActionName = name => `app/characters/${name}`;

const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ONE_SUCCESS = createActionName('FETCH_ONE_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');

/* =====================================================
   ACTIONS
   ===================================================== */

export const fetchStart = () => ({ type: FETCH_START });
export const fetchSuccess = payload => ({ type: FETCH_SUCCESS, payload });
export const fetchError = payload => ({ type: FETCH_ERROR, payload });

/* =====================================================
   THUNKS
   ===================================================== */

// 🔹 pobranie postaci dla anime
export const fetchCharactersByAnime = animeId => async dispatch => {
  dispatch(fetchStart());

  try {
    const res = await api.get(`/anime/${animeId}/characters`);
    dispatch(fetchSuccess(res.data));
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message));
  }
};

// 🔹 pobranie jednej postaci
export const fetchCharacterById = id => async dispatch => {
  dispatch(fetchStart());

  try {
    const res = await api.get(`/characters/${id}`);
    dispatch({ type: FETCH_ONE_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message));
  }
};

/* =====================================================
   INITIAL STATE
   ===================================================== */

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null
};

/* =====================================================
   REDUCER
   ===================================================== */

const charactersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_START:
      return { ...state, loading: true, error: null };

    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload
      };

    case FETCH_ONE_SUCCESS:
      return {
        ...state,
        loading: false,
        selected: action.payload
      };

    case FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default charactersReducer;