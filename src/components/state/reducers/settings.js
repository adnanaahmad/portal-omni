import { SETTINGS_CHANGE, TOGGLE_START_OVER_BUTTON } from "../actions"

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_START_OVER_BUTTON:
    case SETTINGS_CHANGE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
