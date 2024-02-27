import {
  FLOW_RESTART,
  UPDATE_EXISTING_CUSTOMER_INFO,
  UPDATE_EXISTING_CUSTOMER_PERSONAL_DATA,
  RESET_EXISTING_CUSTOMER_INFO,
} from "../actions";

const initialState = {
  loanData: {},
  businessData: {},
  personalData: {},
  addressData: {},
  incomeData: {},
  employmentData: {},
  coApplicantData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_EXISTING_CUSTOMER_INFO:
      return { ...state, ...action.payload };
    case UPDATE_EXISTING_CUSTOMER_PERSONAL_DATA:
      return {
        ...state,
        personalData: { ...state.personalData, ...action.payload },
      };
    case RESET_EXISTING_CUSTOMER_INFO:
    case FLOW_RESTART:
      return initialState;
    default:
      return state;
  }
};
