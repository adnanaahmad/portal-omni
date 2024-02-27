import { LOAN_DETAILS_RESPONSE_SUCCESS,APPLICATION_INITIALIZE, APPLICATION_DATA_UPDATE, APPLICATION_DATA_FORM_SUBMIT, FLOW_RESTART} from "../actions"

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case APPLICATION_INITIALIZE:
    case APPLICATION_DATA_UPDATE:
    case APPLICATION_DATA_FORM_SUBMIT:
      return { ...state, ...action.payload }
      case LOAN_DETAILS_RESPONSE_SUCCESS:
      return { ...state, ...action.payload }
    case FLOW_RESTART:
      return {}
    default:
      return state
  }
}
