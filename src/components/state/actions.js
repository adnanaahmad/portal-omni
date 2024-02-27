export const APP_LOADED = "APP_LOADED"

export const LOCALE_CHANGE = "LOCALE_CHANGE"

export const APPLICATION_INITIALIZE = "APPLICATION_INITIALIZE"
export const APPLICATION_INITIALIZE_SUCCESS = "APPLICATION_INITIALIZE_SUCCESS"
export const APPLICATION_INITIALIZE_ERROR = "APPLICATION_INITIALIZE_ERROR"

export const APPLICATION_DATA_UPDATE = "APPLICATION_DATA_UPDATE"
export const APPLICATION_DATA_FORM_SUBMIT = "APPLICATION_DATA_FORM_SUBMIT"
export const APPLICATION_DATA_FORM_SUBMIT_SUCCESS = "APPLICATION_DATA_FORM_SUBMIT_SUCCESS"
export const APPLICATION_DATA_FORM_SUBMIT_ERROR = "APPLICATION_DATA_FORM_SUBMIT_ERROR"

export const INDIVIDUAL_DATA_UPDATE = "INDIVIDUAL_DATA_UPDATE"
export const INDIVIDUAL_DATA_FORM_SUBMIT = "INDIVIDUAL_DATA_FORM_SUBMIT"
export const INDIVIDUAL_DATA_FORM_SUBMIT_SUCCESS = "INDIVIDUAL_DATA_FORM_SUBMIT_SUCCESS"
export const INDIVIDUAL_DATA_FORM_SUBMIT_ERROR = "INDIVIDUAL_DATA_FORM_SUBMIT_ERROR"

export const BUSINESS_DATA_UPDATE = "BUSINESS_DATA_UPDATE"
export const BUSINESS_DATA_FORM_SUBMIT = "BUSINESS_DATA_FORM_SUBMIT"
export const BUSINESS_DATA_FORM_SUBMIT_SUCCESS = "BUSINESS_DATA_FORM_SUBMIT_SUCCESS"
export const BUSINESS_DATA_FORM_SUBMIT_ERROR = "BUSINESS_DATA_FORM_SUBMIT_ERROR"

export const FLOW_START = "FLOW_START"
export const FLOW_RESTART = "FLOW_RESTART"
export const FLOW_PREV_STEP = "FLOW_PREV_STEP"
export const FLOW_NEXT_STEP = "FLOW_NEXT_STEP"
export const FLOW_COMPLETED = "FLOW_COMPLETED"

export const SETTINGS_CHANGE = "SETTINGS_CHANGE"
export const SETTINGS_LOAD = "SETTINGS_LOAD"
export const LOAN_DETAIL = "LOAN_DETAIL"
export const BUSINESS_INFO_FORM = "BUSINESS_INFO_FORM"
export const BASIC_INFORMATION = "BASIC_INFORMATION"
export const SSN_FORM = "SSN_FORM"
export const DLN_FORM = "DLN_FORM"
export const RESIDENTIAL_ADDRESS_FORM = "RESIDENTIAL_ADDRESS_FORM"
export const INCOME_HOUSING_FORM = "INCOME_HOUSING_FORM"
export const INCOME_ACCOUNT_FORM = "INCOME_ACCOUNT_FORM"
export const INCOME_INFO_FORM = "INCOME_INFO_FORM"
export const EMPLOYMENT_INFO_FORM = "EMPLOYMENT_INFO_FORM"
export const EXISTING_CUSTOMER_INFORMATION = "EXISTING_CUSTOMER_INFORMATION"
export const GET_COAPPLICANT_DETAILS = "GET_COAPPLICANT_DETAILS"
export const EXISTING_DATA_FORM_SUBMIT = "EXISTING_DATA_FORM_SUBMIT"




export const WEB_ACTIVITY = "WEB_ACTIVITY"

export const CONSUMER_INSIGHTS_REQUEST = "CONSUMER_INSIGHTS_REQUEST"
export const BUSINESS_INSIGHTS_REQUEST = "BUSINESS_INSIGHTS_REQUEST"
export const INCOME_INSIGHTS_REQUEST = "INCOME_INSIGHTS_REQUEST"

export const INCOME_REQUEST = "INCOME_REQUEST"
export const INCOME_VERIFY = "INCOME_VERIFY"

export const MFA_REQUEST = "MFA_REQUEST"
export const MFA_VERIFY = "MFA_VERIFY"
export const DOCUMENT_REQUEST = "DOCUMENT_REQUEST"
export const DOCUMENT_VERIFY = "DOCUMENT_VERIFY"
export const SEND_RESTORE_EMAIL = "SEND_RESTORE_EMAIL"
export const SEND_COMPLETE_EMAIL = "SEND_COMPLETE_EMAIL"
export const APPLICATION_STATUS_REQUEST = "APPLICATION_STATUS_REQUEST"
export const APPLICATION_STATUS_CHANGE = "APPLICATION_STATUS_CHANGE"
export const APPLICATION_MFA_STATUS_CHANGE = "APPLICATION_MFA_STATUS_CHANGE"
export const VERIFY_RETURN_LINK = "VERIFY_RETURN_LINK"
export const LOAN_DETAILS_RESPONSE_SUCCESS = "LOAN_DETAILS_RESPONSE_SUCCESS"
export const UPDATE_EXISTING_CUSTOMER_INFO = "UPDATE_EXISTING_CUSTOMER_INFO"
export const UPDATE_EXISTING_CUSTOMER_PERSONAL_DATA = "UPDATE_EXISTING_CUSTOMER_PERSONAL_DATA"
export const RESET_EXISTING_CUSTOMER_INFO = "RESET_EXISTING_CUSTOMER_INFO"
export const POST_EXISTING_CUSTOMER_INFO = "POST_EXISTING_CUSTOMER_INFO"
export const POST_SUMMARY_INFO_FORM = "POST_SUMMARY_INFO_FORM"

export const POST_API_HIT_LOAN_DETAILS = "POST_API_HIT_LOAN_DETAILS"
export const POST_API_HIT_BASIC_INFO = "POST_API_HIT_BASIC_INFO"
export const POST_API_HIT_BUSINESS_INFO = "POST_API_HIT_BUSINESS_INFO"
export const POST_API_HIT_SSN_FORM = "POST_API_HIT_SSN_FORM"
export const POST_API_HIT_DLN_FORM = "POST_API_HIT_DLN_FORM"
export const POST_API_HIT_RESIDENTIAL_ADDRESS_FORM = "POST_API_HIT_RESIDENTIAL_ADDRESS_FORM"
export const POST_API_HIT_INCOME_HOUSING = "POST_API_HIT_INCOME_HOUSING"
export const POST_API_HIT_INCOME_BANK_ACCOUNTS = "POST_API_HIT_INCOME_BANK_ACCOUNTS"
export const POST_API_HIT_INCOME_INFO = "POST_API_HIT_INCOME_INFO"
export const POST_API_HIT_EMPLOYMENT_INFO = "POST_API_HIT_EMPLOYMENT_INFO"

export const FILL_DEMO_DATA = "FILL_DEMO_DATA"
export const FILL_EXISTING_DEMO_DATA = "FILL_EXISTING_DEMO_DATA"
export const FILL_CoApplicant_DATA = "FILL_CoApplicant_DATA"
export const DEMO_MODE = "DEMO_MODE"
export const TOGGLE_START_OVER_BUTTON = "TOGGLE_START_OVER_BUTTON"
export const FILL_EXISTING_COAPPLICANT = "FILL_EXISTING_COAPPLICANT"
export const GET_PHONE_VERIFICATION_TRANSACTION_ID = "GET_PHONE_VERIFICATION_TRANSACTION_ID"
export const GET_USER_DETAILS = "GET_USER_DETAILS"
export const GET_ORGANIZATION_LIST = "GET_ORGANIZATION_LIST"

export const TEMP_MFA_VERIFY = "TEMP_MFA_VERIFY"
export const DEMO_PHONE_NO_CHANGE_REQUEST = "DEMO_PHONE_NO_CHANGE_REQUEST"




export const actionLoanDetailsResponseSuccess = values => ({
  type: LOAN_DETAILS_RESPONSE_SUCCESS,
  payload: { values },
})


export const actionChangeLocale = locale => ({
  type: LOCALE_CHANGE,
  payload: { locale },
})

export const actionAppLoaded = () => ({
  type: APP_LOADED,
})

export const actionLoadSettings = () => ({
  type: SETTINGS_LOAD,
})

export const actionExistingCustomerInformation = () => ({
  type: EXISTING_CUSTOMER_INFORMATION,
})

export const actionLoanDetail = () => ({
  type: LOAN_DETAIL,
})
export const actionBusinessInfoForm = () => ({
  type: BUSINESS_INFO_FORM,
})
export const actionBasicInformation = () => ({
  type: BASIC_INFORMATION,
})

export const actionSSNForm = () => ({
  type: SSN_FORM,
})
export const actionDLNForm = () => ({
  type: DLN_FORM,
})

export const actionResindentialAddressForm = () => ({
  type: RESIDENTIAL_ADDRESS_FORM,
})
export const actionIncomeHousingForm = () => ({
  type: INCOME_HOUSING_FORM,
})
export const actionIncomeAccountForm = () => ({
  type: INCOME_ACCOUNT_FORM,
})
export const actionIncomeInfoForm = () => ({
  type: INCOME_INFO_FORM,
})
export const actionEmploymentInfoForm = () => ({
  type: EMPLOYMENT_INFO_FORM,
})


export const actionSettingsChange = settings => ({
  type: SETTINGS_CHANGE,
  payload: settings,
})

export const actionApplicationInitialize = (values, { dataType, isLastForm, formName }) => ({
  type: APPLICATION_INITIALIZE,
  payload: values,
  metadata: {
    dataType,
    isLastForm,
    formName,
  },
})
export const actionApplicationInitializeSuccess = () => ({
  type: APPLICATION_INITIALIZE_SUCCESS,
  payload: {},
})

export const actionApplicationInitializeError = error => ({
  type: APPLICATION_INITIALIZE_ERROR,
  payload: {},
  error,
})

export const actionApplicationDataUpdate = values => ({
  type: APPLICATION_DATA_UPDATE,
  payload: values,
})

export const actionIndividualDataUpdate = values => ({
  type: INDIVIDUAL_DATA_UPDATE,
  payload: values,
})

export const actionBusinessDataUpdate = values => ({
  type: BUSINESS_DATA_UPDATE,
  payload: values,
})

export const actionApplicationDataFormSubmit = (values, { dataType, isLastForm, formName }) => ({
  type: APPLICATION_DATA_FORM_SUBMIT,
  payload: values,
  metadata: {
    dataType,
    isLastForm,
    formName,
  },
})

export const actionIndividualDataFormSubmit = (values, { dataType, isLastForm, formName }) => ({
  type: INDIVIDUAL_DATA_FORM_SUBMIT,
  payload: values,
  metadata: {
    dataType,
    isLastForm,
    formName,
  },
})

export const actionExistingDataFormSubmit = (values, { formName }) => ({
  type: EXISTING_DATA_FORM_SUBMIT,
  payload: values,
  metadata: {
    formName,
  },
})

export const actionBusinessDataFormSubmit = (values, { dataType, isLastForm, formName }) => ({
  type: BUSINESS_DATA_FORM_SUBMIT,
  payload: values,
  metadata: {
    dataType,
    isLastForm,
    formName,
  },
})


export const actionApplicationDataFormSubmitSuccess = () => ({
  type: APPLICATION_DATA_FORM_SUBMIT_SUCCESS
})

export const actionIndividualDataFormSubmitSuccess = () => ({
  type: INDIVIDUAL_DATA_FORM_SUBMIT_SUCCESS,
})

export const actionBusinessDataFormSubmitSuccess = () => ({
  type: BUSINESS_DATA_FORM_SUBMIT_SUCCESS,
})

export const actionApplicationDataFormSubmitError = error => ({
  type: APPLICATION_DATA_FORM_SUBMIT_ERROR,
  payload: {},
  error,
})

export const actionIndividualDataFormSubmitError = error => ({
  type: INDIVIDUAL_DATA_FORM_SUBMIT_ERROR,
  payload: {},
  error,
})

export const actionBusinessDataFormSubmitError = error => ({
  type: BUSINESS_DATA_FORM_SUBMIT_ERROR,
  payload: {},
  error,
})

export const actionFlowRestart = () => ({
  type: FLOW_RESTART,
})

export const actionResetExistingCustomerInfo = () => ({
  type: RESET_EXISTING_CUSTOMER_INFO,
})

export const actionFlowStart = loanType => ({
  type: FLOW_START,
  payload: loanType,
})

export const flowPrevStep = () => ({
  type: FLOW_PREV_STEP,
})

export const flowNextStep = () => ({
  type: FLOW_NEXT_STEP,
})

export const actionFlowCompleted = () => ({
  type: FLOW_COMPLETED,
})

export const actionWebActivity = (activityType, route) => ({
  type: WEB_ACTIVITY,
  payload: {
    activityType,
    route,
  },
})

export const actionConsumerInsightsRequest = () => ({
  type: CONSUMER_INSIGHTS_REQUEST,
})

export const actionBusinessInsightsRequest = () => ({
  type: BUSINESS_INSIGHTS_REQUEST,
})

export const actionIncomeInsightsRequest = () => ({
  type: INCOME_INSIGHTS_REQUEST,
})

export const actionMFARequest = () => ({
  type: MFA_REQUEST,
})

export const actionMFAVerify = () => ({
  type: MFA_VERIFY,
})

export const actionDocumentRequest = () => ({
  type: DOCUMENT_REQUEST,
})

export const actionDocumentVerify = () => ({
  type: DOCUMENT_VERIFY,
})

export const actionIncomeEmailRequest = () => ({
  type: INCOME_REQUEST,
  payload: {
    request_type: "email",
  },
})

export const actionIncomeSMSRequest = () => ({
  type: INCOME_REQUEST,
  payload: {
    request_type: "sms",
  },
})

export const actionIncomeVerify = () => ({
  type: INCOME_VERIFY,
})

export const actionLoadApplicationStatus = () => ({
  type: APPLICATION_STATUS_REQUEST,
})

export const actionApplicationStatusChange = newStatus => ({
  type: APPLICATION_STATUS_CHANGE,
  payload: {
    status: newStatus,
  },
})

export const actionApplicationMFAStatusChange = newStatus => ({
  type: APPLICATION_MFA_STATUS_CHANGE,
  payload: {
    mfaVerificationStatus: newStatus,
  },
})

export const actionVerifyReturnLink = data => ({
  type: VERIFY_RETURN_LINK,
  payload: data,
})

export const actionSendRestoreEmail = (data) => ({
  type: SEND_RESTORE_EMAIL,
  payload: data
})

export const actionSendCompleteEmail = () => ({
  type: SEND_COMPLETE_EMAIL,
})

export const actionUpdateExistingCustomerData = (value) => ({
  type: UPDATE_EXISTING_CUSTOMER_INFO,
  payload: value
})

export const actionUpdateExistingCustomerPersonalData = (value) => ({
  type: UPDATE_EXISTING_CUSTOMER_PERSONAL_DATA,
  payload: value
})

export const actionPostExistingCustomerData = (value) => ({
  type: POST_EXISTING_CUSTOMER_INFO,
  payload: value
})


export const actionGetCOApplicantDetails = (data) => ({
  type: GET_COAPPLICANT_DETAILS,
  payload: data
})


export const actionPostSummaryInfoData = (data) => ({
  type: POST_SUMMARY_INFO_FORM,
  payload: data
})


export const actionPostAPIHitLoanDetail = (data) => ({
  type: POST_API_HIT_LOAN_DETAILS,
  payload: data
})

export const actionPostAPIHitBasicInfo = (data) => ({
  type: POST_API_HIT_BASIC_INFO,
  payload: data
})

export const actionPostAPIHitBusinessInfo = (data) => ({
  type: POST_API_HIT_BUSINESS_INFO,
  payload: data
})

export const actionPostAPIHitSSNForm = (data) => ({
  type: POST_API_HIT_SSN_FORM,
  payload: data
})

export const actionPostAPIHitDLNForm = (data) => ({
  type: POST_API_HIT_DLN_FORM,
  payload: data
})

export const actionPostAPIHitResidentialAddress = (data) => ({
  type: POST_API_HIT_RESIDENTIAL_ADDRESS_FORM,
  payload: data
})

export const actionPostAPIHitIncomeHousing = (data) => ({
  type: POST_API_HIT_INCOME_HOUSING,
  payload: data
})


export const actionPostAPIHitIncomeBankAccounts = (data) => ({
  type: POST_API_HIT_INCOME_BANK_ACCOUNTS,
  payload: data
})

export const actionPostAPIHitIncomeInfo = (data) => ({
  type: POST_API_HIT_INCOME_INFO,
  payload: data
})

export const actionPostAPIHitEmployementInfo = (data) => ({
  type: POST_API_HIT_EMPLOYMENT_INFO,
  payload: data
})


export const actionFillDemoData = (data) => ({
  type: FILL_DEMO_DATA,
  payload: data
})


export const actionFillExistingDemoData = (data) => ({
  type: FILL_EXISTING_DEMO_DATA,
  payload: data
})


export const actionFillCoApplicantData = (data) => ({
  type: FILL_CoApplicant_DATA,
  payload: data
})

export const actionChangeDemoMode = (data) => ({
  type: DEMO_MODE,
  payload: data
})

export const actionToggleStartOverButton = (data) => ({
  type: TOGGLE_START_OVER_BUTTON,
  payload: data
})

export const actionFillExistingCoApplicant = (data) => ({
  type: FILL_EXISTING_COAPPLICANT,
  payload: data
})

export const actionGetPhoneVerificationId = (data) => ({
  type: GET_PHONE_VERIFICATION_TRANSACTION_ID,
  payload: data
})


export const actionTempMFAVerify = (data) => ({
  type: TEMP_MFA_VERIFY,
  payload: data
})

export const actionPhoneNoChangeReq = (data) => ({
  type: DEMO_PHONE_NO_CHANGE_REQUEST,
  payload: data
})

export const actionGetOrganizationList = () => ({
  type: GET_ORGANIZATION_LIST,
})