// selectors
export const getAllAnimes = state => state.animes.list
export const getAnimesLoading = state => state.animes.loading
export const getAnimesError = state => state.animes.error

// action types
const createActionName = name => `app/animes/${name}`

const FETCH_START = createActionName('FETCH_START')
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS')
const FETCH_ERROR = createActionName('FETCH_ERROR')

// action creators
export const fetchAnimesStart = () => ({ type: FETCH_START })
export const fetchAnimesSuccess = payload => ({
  type: FETCH_SUCCESS,
  payload
})
export const fetchAnimesError = payload => ({
  type: FETCH_ERROR,
  payload
})

// thunk (async)
export const fetchAnimes = () => async dispatch => {
  dispatch(fetchAnimesStart())

  try {
    const res = await fetch('http://localhost:3030/api/animes')
    const data = await res.json()

    dispatch(fetchAnimesSuccess(data))
  } catch (err) {
    dispatch(fetchAnimesError(err.message))
  }
}

// local initial state
const initialState = {
  list: [],
  loading: false,
  error: null
}

// reducer
const animesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_START:
      return { ...state, loading: true, error: null }

    case FETCH_SUCCESS:
      return { ...state, loading: false, list: action.payload }

    case FETCH_ERROR:
      return { ...state, loading: false, error: action.payload }

    default:
      return state
  }
}

export default animesReducer