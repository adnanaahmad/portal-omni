import { APPLICATION_STATUS_CHANGE, APPLICATION_MFA_STATUS_CHANGE } from "../actions"

import ApplicationStatuses from "constants/applicationstates"

const initialState = {
  status: ApplicationStatuses.DATA_COLLECTION,
  mfaVerificationStatus: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case APPLICATION_MFA_STATUS_CHANGE:
    case APPLICATION_STATUS_CHANGE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
