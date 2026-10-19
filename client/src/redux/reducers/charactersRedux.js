
import api from "../../utils/axios";

/* =====================================================
   SELECTORS
   ===================================================== */

/**
 * Selects all characters currently stored in Redux.
 */
export const getAllCharacters = state => state.characters.list;

/**
 * Selects the loading state for character requests.
 */
export const getCharactersLoading = state => state.characters.loading;

/**
 * Selects the latest character-related error.
 */
export const getCharactersError = state => state.characters.error;

/**
 * Selects the currently opened character.
 */
export const getSelectedCharacter = state => state.characters.selected;

/**
 * Selects a character from the list by its MongoDB ID.
 */
export const getCharacterById = (state, id) =>
  state.characters.list.find(character => character._id === id);

/* =====================================================
   ACTION TYPES
   ===================================================== */

const createActionName = name => `app/characters/${name}`;

const FETCH_START = createActionName("FETCH_START");
const FETCH_SUCCESS = createActionName("FETCH_SUCCESS");
const FETCH_ONE_SUCCESS = createActionName("FETCH_ONE_SUCCESS");
const CREATE_SUCCESS = createActionName("CREATE_SUCCESS");
const UPDATE_SUCCESS = createActionName("UPDATE_SUCCESS");
const PHOTO_SUCCESS = createActionName("PHOTO_SUCCESS");
const FETCH_ERROR = createActionName("FETCH_ERROR");
const CLEAR_ERROR = createActionName("CLEAR_ERROR");

/* =====================================================
   ACTIONS
   ===================================================== */

export const fetchStart = () => ({ type: FETCH_START });
export const fetchSuccess = payload => ({ type: FETCH_SUCCESS, payload });
export const fetchOneSuccess = payload => ({
  type: FETCH_ONE_SUCCESS,
  payload,
});
export const createSuccess = payload => ({ type: CREATE_SUCCESS, payload });
export const updateSuccess = payload => ({ type: UPDATE_SUCCESS, payload });
export const photoSuccess = payload => ({ type: PHOTO_SUCCESS, payload });
export const fetchError = payload => ({ type: FETCH_ERROR, payload });
export const clearCharacterError = () => ({ type: CLEAR_ERROR });

/* =====================================================
   THUNKS
   ===================================================== */

/**
 * Fetches all characters belonging to a specific anime.
 *
 * @param {string} animeId - MongoDB ID of the parent anime.
 * @returns {Function} Redux thunk.
 */
export const fetchCharactersByAnime = animeId => async dispatch => {
  dispatch(fetchStart());

  try {
    const response = await api.get(`/characters/anime/${animeId}`);
    dispatch(fetchSuccess(response.data));

    return response.data;
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message));
    throw err;
  }
};

/**
 * Fetches one character by ID.
 *
 * @param {string} id - MongoDB ID of the character.
 * @returns {Function} Redux thunk.
 */
export const fetchCharacterById = id => async dispatch => {
  dispatch(fetchStart());

  try {
    const response = await api.get(`/characters/${id}`);
    dispatch(fetchOneSuccess(response.data));

    return response.data;
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message));
    throw err;
  }
};

/**
 * Creates a character without uploading a photo.
 *
 * @param {Object} data - Character fields, including anime ID.
 * @returns {Function} Redux thunk.
 */
export const createCharacterRequest = data => async dispatch => {
  dispatch(fetchStart());

  try {
    const response = await api.post("/characters", data);
    dispatch(createSuccess(response.data));

    return response.data;
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message));
    throw err;
  }
};

/**
 * Updates the character's text fields.
 *
 * @param {string} id - MongoDB ID of the character.
 * @param {Object} data - Fields to update.
 * @returns {Function} Redux thunk.
 */
export const updateCharacterRequest = (id, data) => async dispatch => {
  dispatch(fetchStart());

  try {
    const response = await api.put(`/characters/${id}`, data);
    dispatch(updateSuccess(response.data));

    return response.data;
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message));
    throw err;
  }
};

/**
 * Uploads or replaces a character's photo.
 * The backend expects the uploaded file under the "photo" field.
 *
 * @param {string} id - MongoDB ID of the character.
 * @param {File} file - Image file selected by the user.
 * @returns {Function} Redux thunk.
 */
export const updateCharacterPhotoRequest = (id, file) => async dispatch => {
  dispatch(fetchStart());

  try {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await api.put(
      `/characters/${id}/photo`,
      formData
    );

    dispatch(photoSuccess(response.data));

    return response.data;
  } catch (err) {
    dispatch(fetchError(err.response?.data?.message || err.message));
    throw err;
  }
};

/* =====================================================
   INITIAL STATE
   ===================================================== */

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

/* =====================================================
   REDUCER
   ===================================================== */

const charactersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload,
        error: null,
      };

    case FETCH_ONE_SUCCESS:
      return {
        ...state,
        loading: false,
        selected: action.payload,
        error: null,
      };

    case CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        selected: action.payload,
        list: [...state.list, action.payload],
        error: null,
      };

    case UPDATE_SUCCESS:
    case PHOTO_SUCCESS:
      return {
        ...state,
        loading: false,
        selected: action.payload,
        list: state.list.map(character =>
          character._id === action.payload._id
            ? action.payload
            : character
        ),
        error: null,
      };

    case FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default charactersReducer;
