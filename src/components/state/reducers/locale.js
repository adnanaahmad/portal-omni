import { LOCALE_CHANGE } from "../actions"

const initialState = {
  locale: "en",
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCALE_CHANGE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
