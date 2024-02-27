import {
  BUSINESS_DATA_UPDATE,
  BUSINESS_DATA_FORM_SUBMIT,
  FLOW_RESTART,
} from "../actions"

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case BUSINESS_DATA_UPDATE:
    case BUSINESS_DATA_FORM_SUBMIT:
      return { ...state, ...action.payload }
    case FLOW_RESTART:
      return {}
    default:
      return state
  }
}
