import React from "react"
import { spawn, call, put, takeEvery, select, takeLatest } from "redux-saga/effects"
import { navigate } from "gatsby"
import { StatusCodes } from "http-status-codes"
import { toast } from "react-toastify"
import ToastMessage from "components/ToastMessage/ToastMessage"
import { defineColorHSL } from "components/Shared/helpers"
import API from "components/api"
import {
  APP_LOADED,
  SETTINGS_LOAD,
  EXISTING_CUSTOMER_INFORMATION,
  LOAN_DETAIL,
  BUSINESS_INFO_FORM,
  BASIC_INFORMATION,
  SSN_FORM,
  DLN_FORM,
  RESIDENTIAL_ADDRESS_FORM,
  // FORMAL_ADDRESS_FORM,
  INCOME_HOUSING_FORM,
  INCOME_ACCOUNT_FORM,
  INCOME_INFO_FORM,
  EMPLOYMENT_INFO_FORM,
  FLOW_RESTART,
  WEB_ACTIVITY,
  actionSettingsChange,
  actionLoadSettings,
  actionApplicationStatusChange,
  actionApplicationMFAStatusChange,
  actionLoanDetail,
  actionBusinessInfoForm,
  actionBasicInformation,
  actionSSNForm,
  actionDLNForm,
  actionResindentialAddressForm,
  // actionFormalAddressForm,
  actionIncomeHousingForm,
  actionIncomeAccountForm,
  actionEmploymentInfoForm,
  APPLICATION_STATUS_REQUEST,
  CONSUMER_INSIGHTS_REQUEST,
  BUSINESS_INSIGHTS_REQUEST,
  MFA_REQUEST,
  MFA_VERIFY,
  DOCUMENT_REQUEST,
  DOCUMENT_VERIFY,
  INCOME_REQUEST,
  INCOME_VERIFY,
  INCOME_INSIGHTS_REQUEST,
  APPLICATION_INITIALIZE,
  SEND_COMPLETE_EMAIL,
  SEND_RESTORE_EMAIL,
  actionApplicationInitializeError,
  actionApplicationInitializeSuccess,
  APPLICATION_DATA_FORM_SUBMIT,
  INDIVIDUAL_DATA_FORM_SUBMIT,
  EXISTING_DATA_FORM_SUBMIT,
  BUSINESS_DATA_FORM_SUBMIT,
  actionIndividualDataFormSubmitSuccess,
  actionBusinessDataFormSubmitSuccess,
  actionApplicationDataFormSubmitSuccess,
  actionLoanDetailsResponseSuccess,
  actionApplicationDataFormSubmitError,
  actionBusinessDataFormSubmitError,
  actionIndividualDataUpdate,
  actionBusinessDataUpdate,
  actionApplicationDataUpdate,
  actionLoadApplicationStatus,
  VERIFY_RETURN_LINK,
  actionExistingCustomerInformation,
  POST_EXISTING_CUSTOMER_INFO,
  actionPostExistingCustomerData,
  GET_COAPPLICANT_DETAILS,
  actionPostSummaryInfoData,
  POST_SUMMARY_INFO_FORM,
  actionPostAPIHitLoanDetail,
  actionPostAPIHitSSNForm,
  actionPostAPIHitBasicInfo,
  actionPostAPIHitDLNForm,
  actionPostAPIHitResidentialAddress,
  actionPostAPIHitBusinessInfo,
  actionPostAPIHitIncomeBankAccounts,
  actionPostAPIHitIncomeInfo,
  actionPostAPIHitIncomeHousing,
  actionPostAPIHitEmployementInfo,
  FILL_DEMO_DATA,
  FILL_EXISTING_DEMO_DATA,
  FILL_CoApplicant_DATA,
  DEMO_MODE,
  FILL_EXISTING_COAPPLICANT,
  GET_PHONE_VERIFICATION_TRANSACTION_ID,
  TEMP_MFA_VERIFY,
  actionUpdateExistingCustomerData,
  DEMO_PHONE_NO_CHANGE_REQUEST,
  actionUpdateExistingCustomerPersonalData,
  GET_ORGANIZATION_LIST
} from "./actions"

import { FLOWS } from "components/FlowControlContainer/FlowControlContainer"
import ApplicationStatuses from "constants/applicationstates"
import FortifidConstants from "constants/fortifid"
import { FORMER_ADDRESS_THRESHOLD } from "constants/common"
import LOAN_TYPES from "data/LoanTypes"
import FinancialAccountTypes from "data/FinancialAccountTypes"
import FormNames from "constants/forms"
import getYearsRange from "../../constants/yearsRange"
import moment from "moment";
import { objectExists, titleCase } from "../Shared/helpers";
import OWNERSHIP_TYPES from "../../data/HomeOwnershipTypes.json";
import { EXPIRED_LINK } from "../../constants/apierrors"

function* loadSettings(action) {
  try {
    const settings = yield call(API.fetchSettings)
    defineColorHSL(document.documentElement, "--color-primary", settings.primaryColor)
    yield put(actionSettingsChange(settings))
  } catch (e) {
    yield toast.error(<ToastMessage id="globalMessages.settingsLoadingError" />)
  }
}

function* startApplication(action) {
  yield put(actionLoadSettings())
}

function* restartAplication(action) {
  const settings = yield select(state => state.settings)
  let hash = '';
  if (settings.selectedLoanType) {
    if (settings.selectedLoanType === 'personal_loan') {
      hash = '#personal_loan'
    } else if (settings.selectedLoanType === 'small_business') {
      hash = '#small_business'
    }
  }
  yield navigate(`/${hash}`, { replace: true })
}

function* redirect(action) {
  const applicationData = yield select(state => state.applicationData)
  const individualData = yield select(state => state.individualData)
  const { formName, isLastForm } = action.metadata
  let submittedStep = FLOWS[applicationData.flowType].findIndex(s => s.name === formName)
  if (formName === FormNames.FORM_INCOME_HOUSING && individualData.addressLivePeriod >= FORMER_ADDRESS_THRESHOLD) {
    submittedStep += 1 // skip former address
  }

  if (formName === FormNames.FORM_DISCLAIMER && applicationData.coApplicant) {
    submittedStep += 1 // skip loan details
  }

  if (isLastForm) {
    yield navigate("/applicationstatus")
  } else {
    yield navigate(`#${FLOWS[applicationData.flowType][submittedStep + 1].name}`)
  }
}

function* errorHandler(e) {
  const { status } = yield select(state => state.applicationStatus)
  if (e.response) {
    switch (e.response.status) {
      case StatusCodes.TOO_MANY_REQUESTS:
        yield toast.info(<ToastMessage id="applicationStatusPage.tooManyRequests" />)
        let nextStatus = ApplicationStatuses.ERROR
        if (status === ApplicationStatuses.SECURE_MFA_REQUEST) {
          nextStatus = ApplicationStatuses.SECURE_MFA_ERROR
        } else if (status === ApplicationStatuses.INCOME_BANK_VERIFICATION_REQUEST) {
          nextStatus = ApplicationStatuses.INCOME_BANK_VERIFICATION_ERROR
        } else if (status === ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST) {
          nextStatus = ApplicationStatuses.DOCUMENT_VERIFICATION_ERROR
        }
        yield put(actionApplicationStatusChange(nextStatus))
        break
      case StatusCodes.CONFLICT:
        yield put(actionLoadApplicationStatus())
        break
      default:
        yield put(actionApplicationStatusChange(ApplicationStatuses.ERROR))
    }
  } else {
    yield put(actionApplicationStatusChange(ApplicationStatuses.ERROR))
  }
}

function* existingCustomerInformation(action) {
  yield put(actionExistingCustomerInformation())
}

function* loanDetail(action) {
  yield put(actionLoanDetail())
}
function* businessInfoForm(action) {
  yield put(actionBusinessInfoForm())
}

function* basicInformation(action) {
  yield put(actionBasicInformation())
}

function* ssnForm(action) {
  yield put(actionSSNForm())
}

function* dlnForm(action) {
  yield put(actionDLNForm())
}

function* residentialAddressForm(action) {
  yield put(actionResindentialAddressForm())
}
// function* formalAddressForm(action) {
//   yield put(actionFormalAddressForm())
// }
function* incomeHousingForm(action) {
  yield put(actionIncomeHousingForm())
}
function* incomeAccountForm(action) {
  yield put(actionIncomeAccountForm())
}
function* incomeInfoForm(action) {
  yield put(actionIncomeAccountForm())
}
function* employmentInfoForm(action) {
  yield put(actionEmploymentInfoForm())
}

function* postExistingCustomerSummary(action) {
  yield put(actionPostExistingCustomerData())
}

function* postSummaryInfoData(action) {
  yield put(actionPostSummaryInfoData())
}


function* processWebActivity(action) {
  const { applicationId } = yield select(state => state.applicationData)
  try {
    if (applicationId) {
      yield call(API.saveWebActivity, { ...action.payload, applicationId })
    }
  } catch (e) {
    console.log("Unable to send web activity")
  }
}

function* getCoApplicantDetails(action) {
  let values;
  let applicationDataObj;
  let individualDataObj;
  let businessDataObj;
  let loan_type;
  try {
    let response = yield call(API.saveCoApplicantData, action.payload);
    // console.log("Get Coapplicant details  ", response);
    values = response.data.userdetail;
  
    if (response.status === 200 && response.data.userdetail !== undefined && response.data.userdetail !== null) {
      if (values.type === LOAN_TYPES.personal_loan) {
        loan_type = LOAN_TYPES.personal_loan;
      } else if (values?.type === LOAN_TYPES.small_business) {
        loan_type = LOAN_TYPES.small_business;
      }
      applicationDataObj = {
        "loanType": loan_type,
        "flowType": loan_type,
        "applicationId": values?.app_id,
        "existingCustmerTypes": false
      }
  
      if (loan_type === LOAN_TYPES.small_business) {
        let businessInfo = values?.business_information;
        businessDataObj = {
          addressStreet: businessInfo.address,
          addressCity: businessInfo.city,
          doingBusinessAs: businessInfo.business_identity || '',
          phoneNumber: businessInfo.phone,
          addressState: businessInfo.state,
          businessType: businessInfo.business_type,
          addressZip: businessInfo.zip,
          typeOfOwnership: businessInfo.owner_type,
          companyName: businessInfo.company,
          webSite: businessInfo.website || '',
          dateEstablished: moment(businessInfo.date_established).format("MM/DD/YYYY"),
          registrationState: businessInfo.registration_state,
          federalIdNumber: businessInfo.federal_number,
          federalIdNumberType: businessInfo.federal_number_type.toUpperCase(),
          addressAptSuiteNumber: businessInfo.address_option || '',
        }
        yield put(actionBusinessDataUpdate(businessDataObj));
      }
  
      individualDataObj = {
        "id": values?.id,
        "main_app_id": values?.main_app_id,
        "app_id": values?.app_id,
        "firstName": values?.personal_information.first_name,
        "middleName": values?.personal_information.middle_name,
        "lastName": values?.personal_information.last_name,
        "mobilePhone": values?.personal_information.phone,
        "emailAddress": values?.personal_information.email,
        "loan_information_id": values?.loan_information_id,
        "coApplicantReturnFlow": response.data.coApplicantReturnFlow,
        "isDemoMode": localStorage.getItem('demo')
      }
      yield put(actionApplicationDataUpdate(applicationDataObj));
      yield put(actionIndividualDataUpdate(individualDataObj));
      yield put(actionApplicationDataFormSubmitSuccess())
      localStorage.setItem("app_id", response.data.userdetail.app_id);
      localStorage.setItem("loan_information_id", response.data.userdetail.loan_information_id);
      yield navigate("#basicInfoForm")
    }
    return response.data;
  } catch (error) {
    applicationDataObj = {
      coApplicantReturnFlowError: true,
      errorMessage: "Something went wrong"
    }
    if (error.response?.status === 400 && error.response?.data?.message === EXPIRED_LINK && error.response?.data?.success === false) {
      applicationDataObj.errorMessage = EXPIRED_LINK;
    }
    yield put(actionApplicationDataUpdate(applicationDataObj));
  }
}


function* processApplicationInitialize(action) {
  yield put(actionSettingsChange({ submitDisabled: true }))
  const applicationData = yield select(state => state.applicationData)

  try {
    const response = yield call(API.createApplication, { ...applicationData, formName: action.metadata.formName })
    // yield put(actionApplicationDataUpdate(response.data.data))
    yield put(actionIndividualDataUpdate(response.data.data.individualData))
    yield put(actionBusinessDataUpdate(response.data.data.businessData))
    yield put(actionApplicationInitializeSuccess())
    yield navigate(`#${FLOWS[applicationData.flowType][0].name}`)
  } catch (e) {
    yield toast.error(<ToastMessage id="globalMessages.submissionError" />)
    yield put(actionApplicationInitializeError(e))
  }
  yield put(actionSettingsChange({ submitDisabled: false }))
}

function* processApplicationDataFormSubmit(action) {
  yield put(actionSettingsChange({ submitDisabled: true }));
  const applicationData = yield select(state => state.applicationData);
  const individualData = yield select(state => state.individualData);
  const existingCustomerData = yield select(state => state.existingCustomerData);
  yield put(actionApplicationDataUpdate({ showLoading: true }));

  const bodyLoanDetails = {
    "type": applicationData?.loanType,
    "request_amount": applicationData?.loanAmount,
    "purpose": applicationData?.loanPurpose
  }
  const bodyExistingCustomerInformation = {
    "dob": applicationData.birthDate,
    "ssn": applicationData.federalIdNumber,
    "zip": applicationData.addressZip,
    "type": applicationData.loanType,
  }
  try {
    switch (action.metadata.formName) {
      case FormNames.FORM_LOAN_DETAILS:
        yield call(redirect, action);
        // let responseLoanDetails = yield call(API.saveLoanFormApplicationData, bodyLoanDetails);
        // console.log("responseLoanDetails", responseLoanDetails);
        // if ((responseLoanDetails.status === 200) || (responseLoanDetails.data.loaninformation === "Update Successfully")) {
        //   yield console.log("response", responseLoanDetails);
        //   yield put(actionPostAPIHitLoanDetail({ isLoanDetailPostApiHit: true }));
        //   yield put(actionApplicationDataFormSubmitSuccess());
        //   if (responseLoanDetails.data.loaninformation !== "Update Successfully")
        //     yield put(actionIndividualDataUpdate({ "applicationId": responseLoanDetails.data.app_id.app_id }));
        //   yield call(redirect, action)
        //   // yield navigate("#businessInfoForm")
        // }
        break;

      case FormNames.FORM_EXISTING_CUSTOMER_INFORMATION:
        // return in non demo mode since we don’t know the requirements for the bank api yet
        if (!individualData.isDemoMode || (individualData.isDemoMode && !objectExists(existingCustomerData.personalData))) {
          yield put(actionSettingsChange({ submitDisabled: false }));
          yield put(actionApplicationDataUpdate({ showLoading: false }));
          yield toast.error(<ToastMessage id="globalMessages.submissionError" />);
          return;
        }

        // update co app data in Existing Customer State
        const coapplicantInfoObject = {
          coApplication: applicationData.coApplication,
          coApplicant: applicationData.coApplicant,
          coApplicationFirstName: applicationData.coApplicationFirstName,
          coApplicationMiddleName: applicationData.coApplicationMiddleName,
          coApplicationLastName: applicationData.coApplicationLastName,
          coApplicationEmailAddress: applicationData.coApplicationEmailAddress,
        }
        yield put(actionUpdateExistingCustomerData({coApplicantData: coapplicantInfoObject}));

        // const response = yield call(API.getExistingCustomerInformation, bodyExistingCustomerInformation);

        // if (response.status === 200 && response.data.success === false) {
        //   yield toast.error(<ToastMessage id="globalMessages.getExistingDataError" />)
        // } else if (response.status === 200 && response.data.existingdata !== null) {
        //   // update existing customerr redux state

        // }
        yield call(redirect, action);
        break;

      default:
        yield call(API.saveApplicationData, { ...applicationData, formName: action.metadata.formName })
        yield put(actionApplicationDataFormSubmitSuccess())
        yield call(redirect, action)
        break;

    }
  } catch (e) {
    yield toast.error(<ToastMessage id="globalMessages.submissionError" />)
    yield put(actionApplicationDataFormSubmitError(e))
  }
  yield put(actionSettingsChange({ submitDisabled: false }));
  yield put(actionApplicationDataUpdate({ showLoading: false }));
}

function* processExistingDataFormSubmit(action) {
  try {
    switch (action.metadata.formName) {
      case FormNames.FORM_EXISTING_CUSTOMER_LOADING_DATA:
        yield call(redirect, action);
        break;
      case FormNames.FORM_BASIC_INFO:
        yield put(actionUpdateExistingCustomerData({ personalData: action.payload }));
        yield put(actionSettingsChange({ closeForm: true }));
        break;
      case FormNames.FORM_ADDRESS:
        yield put(actionUpdateExistingCustomerData({ addressData: action.payload }));
        yield put(actionSettingsChange({ closeForm: true }));
        break;
      case FormNames.FORM_INCOME_INFO:
        yield put(actionUpdateExistingCustomerData({ incomeData: action.payload }));
        yield put(actionSettingsChange({ closeForm: true }));
        break;
      case FormNames.FORM_EMPLOYMENT_INFO:
        yield put(actionUpdateExistingCustomerData({ employmentData: action.payload }));
        yield put(actionSettingsChange({ closeForm: true }));
        break;
      case FormNames.FORM_BUSINESS_INFO:
        yield put(actionUpdateExistingCustomerData({ businessData: action.payload }));
        yield put(actionSettingsChange({ closeForm: true }));
        break;
      case FormNames.FORM_EXISTING_CUSTOMER_SUMMARY:
        yield put(actionApplicationDataUpdate({ showLoading: true }));
        yield put(actionSettingsChange({ submitDisabled: true }));
        let {personalData, coApplicantData, businessData, addressData, incomeData, loanData, employmentData} = yield select(state => state.existingCustomerData);
        const {loanType, loanAmount, loanPurpose, organizationId} = yield select(state => state.applicationData);
        loanData = {...loanData, loanType, loanAmount, loanPurpose};
        const postExistingCustomerSummaryData = processDataBeforeSubmit(businessData, personalData, coApplicantData, addressData, incomeData, loanData, employmentData, organizationId);
        const responsePost = yield call(API.savePostSummaryInfoData, postExistingCustomerSummaryData);
        if (responsePost.status === 200 && responsePost.data.success === false && responsePost.data.message === "The phone number is already in use") {
          yield toast.error(<ToastMessage id="globalMessages.phoneValidation" />)
        } else if (responsePost.status === 200 && responsePost.data.success === false && responsePost.data.message === "The SSN number is already in use") {
          yield toast.error(<ToastMessage id="globalMessages.ssnValidation" />)
        } else if ((responsePost.status === 200) && (responsePost.data.success === true)) {
          yield put(actionApplicationDataUpdate({ "applicationId": localStorage.getItem("app_id") }))
          yield navigate("/applicationstatus")
        }
        break;  
      default:
        break;
    }
  } catch (error) {
    yield toast.error(<ToastMessage id="globalMessages.submissionError" />)
    yield put(actionApplicationDataFormSubmitError(error))
  }
  yield put(actionSettingsChange({ submitDisabled: false }));
  yield put(actionApplicationDataUpdate({ showLoading: false }));
}

function* processIndividualDataFormSubmit(action) {
  yield put(actionSettingsChange({ submitDisabled: true }))
  yield put(actionApplicationDataUpdate({ showLoading: true }));

  // const individualData = yield select(state => state.individualData);
  // const applicationData = yield select(state => state.applicationData);
  const settings = yield select(state => state.settings);

  // let basicInformationPostBody = {
  //   "app_id": `${localStorage.getItem("app_id")}`,
  //   "first_name": individualData.firstName,
  //   "middle_name": individualData.middleName,
  //   "last_name": individualData.lastName,
  //   "phone": individualData.mobilePhone,
  //   "email": individualData.emailAddress,
  //   "loan_information_id": `${localStorage.getItem("loan_information_id")}`,
  //   "co_application": individualData.coApplication,
  //   "first_name_coapplication": individualData.coApplicationFirstName,
  //   "middle_name_coapplication": individualData.coApplicationMiddleName,
  //   "last_name_coapplication": individualData.coApplicationLastName,
  //   "email_coapplication": individualData.coApplicationEmailAddress
  // }

  // let ssnFormPostBody = {
  //   "app_id": `${localStorage.getItem("app_id")}`,
  //   "ssn": individualData.federalIdNumber,
  //   "dob": individualData.birthDate,
  //   "is_us_citizen": individualData.isUSCitizen
  // }
  // let dlnFormPostBody = {
  //   "app_id": `${localStorage.getItem("app_id")}`,
  //   "state_issue": individualData.driversLicenseState,
  //   "exp_date": individualData.driversLicenseExpireDate,
  //   "dl_number": individualData.driversLicenseNumber,
  // }
  // let residentialAddressFormBody = {
  //   "app_id": `${localStorage.getItem("app_id")}`,
  //   "address": individualData.addressStreet,
  //   "city": individualData.addressCity,
  //   "state": individualData.addressState,
  //   "zip": individualData.addressZip,
  //   "live_period": individualData.addressLivePeriod,
  //   "address_option": individualData.addressAptSuiteNumber
  // }
  // let formerAddressFormBody = {
  //   "app_id": `${localStorage.getItem("app_id")}`,
  //   "address": individualData.formerAddressStreet,
  //   "city": individualData.formerAddressCity,
  //   "state": individualData.formerAddressState,
  //   "zip": individualData.formerAddressZip,
  //   "live_period": individualData.formerAddressLivePeriod,
  //   "address_option": individualData.formerAddressAptSuiteNumber
  // }
  // let incomeHousingFormBody = {
  //   "app_id": `${localStorage.getItem("app_id")}`,
  //   "property_use_type": individualData.homeRentOrOwn,
  //   "monthly_rent": individualData.homeMonthlyRentMortgage,
  //   "mortgage": individualData.homeMonthlyRentMortgage,
  //   "note": individualData.homeAdditionalDetails,
  //   "is_fully_own": individualData.homeIsFullyOwnedNoMortgage
  // }
  // let incomeAccountFormBody = {
  //   "app_id": `${localStorage.getItem("app_id")}`,
  //   "bank_name": `${individualData.financialBankName}`,
  //   "account_type": `${individualData.financialAccountType}`,
  //   "cash_advance": `${individualData.financialCreditCardCashAdvStatus}`
  // }
  // let incomeInfoFormBody = {
  //   "app_id": `${localStorage.getItem("app_id")}`,
  //   "income_type": `${individualData.incomeSource}`,
  //   "annual_income": `${individualData.incomeIndividualAnnualGross}`,
  //   "household_income": `${individualData.incomeHouseholdAnnualGross}`,
  //   "net_income": `${individualData.netIncome}`,
  // }
  // let employmentInfoFormBody = {
  //   "app_id": `${localStorage.getItem("app_id")}`,
  //   "status": `${individualData.employmentStatus}`,
  //   "name": `${individualData.employmentEmployerName}`,
  //   "phone": `${individualData.employmentPhoneNumber}`,
  //   "job_title": `${individualData.employmentJobTitle}`,
  //   "length": `${individualData.employmentLength}`,
  //   "address": `${individualData.employmentAddressStreet}`,
  //   "city": `${individualData.employmentAddressCity}`,
  //   "state": `${individualData.employmentAddressState}`,
  //   "zip": `${individualData.employmentAddressZip}`,
  //   "address_option": `${individualData.employmentAddressAptSuiteNumber}`
  // }

  // let summaryDataPost = {
  //   app_id: `${localStorage.getItem("app_id")}`,
  //   "first_name": individualData.firstName,
  //   "middle_name": individualData.middleName,
  //   "last_name": individualData.lastName,
  //   "phone": individualData.mobilePhone,
  //   "email": individualData.emailAddress,
  //   "loan_information_id": `${localStorage.getItem("loan_information_id")}`,
  //   "co_application": individualData.coApplication,
  //   "first_name_coapplication": individualData.coApplicationFirstName,
  //   "middle_name_coapplication": individualData.coApplicationMiddleName,
  //   "last_name_coapplication": individualData.coApplicationLastName,
  //   "email_coapplication": individualData.coApplicationEmailAddress
  // }

  try {
    switch (action.metadata.formName) {
      case FormNames.FORM_BASIC_INFO:
        !(settings.editForm) ? yield call(redirect, action) : yield navigate("/#summaryInfoForm");
        // let responseEditSSN, responseEditDLN
        // const response = yield call(API.saveBasicInformationFormData, basicInformationPostBody);
        // if (settings.editForm) {
        //   responseEditSSN = yield call(API.saveSSNFormData, ssnFormPostBody);
        //   responseEditDLN = yield call(API.saveDLNFormData, dlnFormPostBody);
        // }
        // if (response.data.success === false && response.data.message === "The email address is already in use") {
        //   yield toast.error(<ToastMessage id="globalMessages.EmailValidation" />)
        // } else if (response.data.success === false && response.data.message === "The phone number is already in use") {
        //   yield toast.error(<ToastMessage id="globalMessages.phoneValidation" />)
        // } else if (response.data.success === false && response.data.message === "The SSN number is already in use") {
        //   yield toast.error(<ToastMessage id="globalMessages.ssnValidation" />)
        // } else if (response.data.success === false && response.data.message === "The co application email address is already in use") {
        //   yield toast.error(<ToastMessage id="globalMessages.coApplicantEmailValidation" />)
        // } else if (settings.editForm) {
        //   if(responseEditSSN.status === 200 && responseEditDLN.status === 200){
        //     yield navigate("/#summaryInfoForm");
        //   }
        // } else {
        //   // yield put(actionPostAPIHitBasicInfo({ isBasicInfoPostApiHit: true }))
        //   yield call(redirect, action);
        // }
        break;

      case FormNames.FORM_SSN:
        yield call(redirect, action);
        // let responseSSN = yield call(API.saveSSNFormData, ssnFormPostBody);
        // if (responseSSN.status === 200) {
        //   yield put(actionPostAPIHitSSNForm({ isSSNInfoPostApiHit: true }))
        //   yield call(redirect, action)
        // }
        break;

      case FormNames.FORM_DLN:
        yield call(redirect, action)
        // let responseDLN = yield call(API.saveDLNFormData, dlnFormPostBody);
        // if (responseDLN.status === 200) {
        //   yield put(actionPostAPIHitDLNForm({ isDLNInfoPostApiHit: true }))
        //   yield call(redirect, action)
        // }
        break;

      case FormNames.FORM_ADDRESS:
        !(settings.editForm) ? yield call(redirect, action) : yield navigate("/#summaryInfoForm");
        // let responseEditIncomeHousing;
        // let responseEditFormerAddress;
        // let responseResidentalAddress = yield call(API.saveResidentialAddressForm, residentialAddressFormBody);
        // if(settings.editForm) {
        //   responseEditIncomeHousing = yield call(API.saveIncomeHousingForm, incomeHousingFormBody);
        //   if (residentialAddressFormBody.live_period < FORMER_ADDRESS_THRESHOLD) responseEditFormerAddress = yield call(API.saveFormerAddressForm, formerAddressFormBody);
        // }
        // if (responseResidentalAddress.status === 200) {
        //   yield put(actionPostAPIHitResidentialAddress({ isResidentialAddressPostApiHit: true }));
        //   if(settings.editForm) {
        //     if((residentialAddressFormBody.live_period < FORMER_ADDRESS_THRESHOLD) ? 
        //     (responseEditIncomeHousing.status === 200 && responseEditFormerAddress.status === 200) :
        //      responseEditIncomeHousing.status === 200) {
        //       yield navigate("/#summaryInfoForm");
        //     }
        //   } else {
        //     yield call(redirect, action);
        //   }
        // }
        break;

      case FormNames.FORM_FORMER_ADDRESS:
        yield call(redirect, action);
        // let responseFormerAddress = yield call(API.saveFormerAddressForm, formerAddressFormBody);
        // if (responseFormerAddress.status === 200) {
        //   yield call(redirect, action);
        // }
        break;

      case FormNames.FORM_INCOME_HOUSING:
        yield call(redirect, action);
        // let incomeHousingResponse = yield call(API.saveIncomeHousingForm, incomeHousingFormBody);
        // if (incomeHousingResponse.status === 200) {
        //   yield put(actionPostAPIHitIncomeHousing({ isIncomeHousingPostApiHit: true }));
        //   yield call(redirect, action)
        // }
        break;

      case FormNames.FORM_INCOME_BANK_ACCOUNTS:
        yield call(redirect, action);
        // let responseIncomeBankAccount = yield call(API.saveIncomeAccountForm, incomeAccountFormBody);
        // if (responseIncomeBankAccount.status === 200) {
        //   yield put(actionPostAPIHitIncomeBankAccounts({ isIncomeBankAccountPostApiHit: true }));
        //   yield call(redirect, action)
        // }
        break;

      case FormNames.FORM_INCOME_INFO:
        !(settings.editForm) ? yield call(redirect, action) : yield navigate("/#summaryInfoForm");
        // let responseEditIncomeBankAccount;
        // let responseIncomeInfo = yield call(API.saveIncomeInfoForm, incomeInfoFormBody);
        // if (settings.editForm) {
        //   responseEditIncomeBankAccount = yield call(API.saveIncomeAccountForm, incomeAccountFormBody);
        // }
        // if (responseIncomeInfo.status === 200) {
        //   yield put(actionPostAPIHitIncomeInfo({ isIncomeInfoPostApiHit: true }))
        //   if (settings.editForm) {
        //     if (responseEditIncomeBankAccount.status === 200) {
        //       yield navigate("/#summaryInfoForm");
        //     }
        //   } else {
        //     yield call(redirect, action);
        //   }
        // }
        break;

      case FormNames.FORM_EMPLOYMENT_INFO:
        !(settings.editForm) ? yield call(redirect, action) : yield navigate("/#summaryInfoForm");
        // let employementInfoResponse = yield call(API.saveEmploymentInfoForm, employmentInfoFormBody);
        // if (employementInfoResponse.status === 200) {
        //   yield put(actionPostAPIHitEmployementInfo({ isEmployementInfoPostApiHit: true }));
        //   if (settings.editForm) {
        //     yield navigate("/#summaryInfoForm");
        //   } else {
        //     yield call(redirect, action);
        //   }
        // }
        break;

      case FormNames.FORM_SUMMARY_INFO:
        let {loanPurpose, loanType, loanAmount, organizationId} = yield select(state => state.applicationData);
        let individualData = yield select(state => state.individualData);
        let businessData = yield select(state => state.businessData);
        individualData = {...individualData, loanAmount, loanPurpose, loanType};
        //console.log(individualData, businessData, applicationData);
        const postSummaryData = processDataBeforeSubmit(businessData, individualData, individualData, individualData, individualData, individualData, individualData, organizationId);
        const responseSummaryPost = yield call(API.savePostSummaryInfoData, postSummaryData);
        console.log(postSummaryData);
        if ((responseSummaryPost.status === 200) && (responseSummaryPost.data.success === true)) {
          yield put(actionApplicationDataUpdate({ "applicationId": localStorage.getItem("app_id") }))
          yield navigate("/applicationstatus");
        }

        // const individualData = yield select(state => state.individualData)
        // let responseSummaryPost = yield call(API.savePostSummaryInfoData, summaryDataPost);
        // if ((responseSummaryPost.status === 200) && (responseSummaryPost.data.success === true)) {
        //   yield put(actionApplicationDataUpdate({ "applicationId": localStorage.getItem("app_id") }))
        //   yield navigate("/applicationstatus")
        //   // yield call(redirect, action)
        //   // yield console.log("Condition matched", responseSummaryPost);
        // }
        break;

      default:
        // yield call(API.saveIndividualData, { ...individualData, formName: action.metadata.formName })
        // yield put(actionIndividualDataFormSubmitSuccess())
        yield call(redirect, action)
        break;
    }

  } catch (e) {
    yield toast.error(<ToastMessage id="globalMessages.submissionError" />)
    yield put(actionApplicationDataFormSubmitError(e))
  }
  yield put(actionSettingsChange({ submitDisabled: false }))
  yield put(actionApplicationDataUpdate({ showLoading: false }));
}

function* processBusinessDataFormSubmit(action) {
  const settings = yield select(state => state.settings);
  if (action.metadata.formName === FormNames.FORM_BUSINESS_INFO) {
    !(settings.editForm) ? yield call(redirect, action) : yield navigate("/#summaryInfoForm");
  }
  // yield put(actionSettingsChange({ submitDisabled: true }))
  // const businessData = yield select(state => state.businessData);
  // const settings = yield select(state => state.settings);
  // yield put(actionApplicationDataUpdate({ showLoading: true }));
  // try {
  //   let businessInfoFormBody = {
  //     "app_id": localStorage.getItem("app_id"),
  //     "business_type": `${businessData.businessType}`,
  //     "owner_type": `${businessData.typeOfOwnership}`,
  //     "company": `${businessData.companyName}`,
  //     "federal_number_type": `${businessData.federalIdNumberType}`,
  //     "federal_number": `${businessData.federalIdNumber}`,
  //     "website": `${businessData.webSite}`,
  //     "address": `${businessData.addressStreet}`,
  //     "city": `${businessData.addressCity}`,
  //     "state": `${businessData.addressState}`,
  //     "registration_state": `${businessData.registrationState}`,
  //     "zip": `${businessData.addressZip}`,
  //     "phone": `${businessData.phoneNumber}`,
  //     "date_established": `${businessData.dateEstablished}`,
  //     "business_identity": `${businessData.doingBusinessAs}`,
  //     "address_option": `${businessData.addressAptSuiteNumber}`,
  //   }
  //   if (action.metadata.formName === "businessInfoForm") {
  //     const businessInfoResponse = yield call(API.saveBusinessData, businessInfoFormBody)
  //     if (businessInfoResponse.status === 200) {
  //       yield put(actionPostAPIHitBusinessInfo({ isBasinessInfoPostApiHit: true }));
  //       if (settings.editForm){
  //         yield navigate("/#summaryInfoForm");
  //       } else {
  //         yield call(redirect, action)
  //       }
  //     }
  //   } else {
  //     yield call(API.saveBusinessData, { ...businessData, formName: action.metadata.formName })
  //     yield put(actionBusinessDataFormSubmitSuccess())
  //     yield call(redirect, action)
  //   }
  // } catch (e) {
  //   yield toast.error(<ToastMessage id="globalMessages.submissionError" />)
  //   yield put(actionBusinessDataFormSubmitError(e))
  // }
  // yield put(actionSettingsChange({ submitDisabled: false }))
  // yield put(actionApplicationDataUpdate({ showLoading: false }));
}

function* processApplicationStatusRequest(action) {
  const { applicationId } = yield select(state => state.applicationData)
  // const { status } = yield select(state => state.applicationStatus)
  try {
    const result = yield call(API.getApplicationState, applicationId)
    console.log(result)
    // yield put(actionApplicationDataUpdate(result.data.data.applicationData))
   // yield put(actionIndividualDataUpdate(result.data.data.individualData))
   // yield put(actionBusinessDataUpdate(result.data.data.businessData))
    switch (result.data.status) {
      case 'mfaVerified':
           yield put(actionApplicationStatusChange(ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST))
        break;
      case 'documentVerified':
           yield put(actionApplicationStatusChange(ApplicationStatuses.INCOME_BANK_VERIFICATION_REQUEST))
        break;
      case 'incomeInsightsVerified':
           yield put(actionApplicationStatusChange(ApplicationStatuses.DONE))
        break;
      default:
        yield put(actionApplicationStatusChange(ApplicationStatuses.SECURE_MFA_REQUEST))
    }
  } catch (e) {
    yield toast.error(<ToastMessage id="globalMessages.stateLoadError" />)
    yield put(actionApplicationStatusChange(ApplicationStatuses.ERROR))
  }
}

function* processConsumerInsightsRequest(action) {
  const { applicationId, loanType } = yield select(state => state.applicationData)
  try {
    yield call(API.getConsumerInsights, applicationId)
    const nextStatus =
      loanType === LOAN_TYPES.small_business ? ApplicationStatuses.BUSINESS_INSIGHTS : ApplicationStatuses.SEND_EMAIL_RESTORE
    yield put(actionApplicationStatusChange(nextStatus))
  } catch (e) {
    yield put(actionApplicationStatusChange(ApplicationStatuses.ERROR))
  }
}

function* processBusinessInsightsRequest(action) {
  const { applicationId } = yield select(state => state.applicationData)
  try {
    yield call(API.getBusinessInsights, applicationId)
    yield put(actionApplicationStatusChange(ApplicationStatuses.SEND_EMAIL_RESTORE))
  } catch (e) {
    yield put(actionApplicationStatusChange(ApplicationStatuses.ERROR))
  }
}

function* processSendRestoreEmailRequest(action) {
  const { applicationId } = yield select(state => state.applicationData)
  try {
    let response = yield call(API.sendRestoreEmail, action.payload);
    if (response.data.userdetail === "Email is not exists" && response.status === 200) {
      yield toast.error(<ToastMessage id="globalMessages.emailValidation" />)
    }
    if (response.data.userdetail === "Please check your mail" && response.status === 200) {
      yield toast.success(<ToastMessage id="globalMessages.varificationCodeSentSuccess" />)
      yield navigate("/return");
    }
    yield put(actionApplicationStatusChange(ApplicationStatuses.SECURE_MFA_REQUEST))
  } catch (e) {
    yield toast.error(<ToastMessage id="globalMessages.submissionError" />)
    yield put(actionApplicationStatusChange(ApplicationStatuses.ERROR))
  }
}

function* processSendCompleteEmailRequest(action) {
  const { applicationId } = yield select(state => state.applicationData)
  try {
    yield call(API.sendCompleteEmail, applicationId)
    yield put(actionApplicationStatusChange(ApplicationStatuses.DONE))
  } catch (e) {
    yield put(actionApplicationStatusChange(ApplicationStatuses.ERROR))
  }
}

function* processMFARequest(action) {
  let body;
  yield put(actionSettingsChange({ submitDisabled: true }))
  const applicationData = yield select(state => state.applicationData);
  const individualData = yield select(state => state.individualData);
  const existingCustomerData = yield select(state => state.existingCustomerData)

  const { applicationId } = yield select(state => state.applicationData);
  // yield console.log("Send MFA Request ", applicationData);
  let bodyNewUser = {
    "applicationId": applicationData.applicationId,
    "phone": individualData.mobilePhone
  }
  let bodyExistingUser = {
    "applicationId": applicationData.applicationId,
    "phone": existingCustomerData.personalData?.mobilePhone,
  }
  if (applicationData.flowType !== "Existing Customer") {
    body = bodyNewUser;
  } else {
    body = bodyExistingUser;
  }
  try {
    let response = yield call(API.sendMFARequest, body);
    console.log(response);
    if ((response.status === 200) && (response.data.success === true)) {
      yield put(actionApplicationStatusChange(ApplicationStatuses.SECURE_MFA_VERIFY))
    } else if (response.data.success === false) {
      yield toast.error(<ToastMessage id="Please try again" />)
    }
  } catch (e) {
    yield call(errorHandler, e)
  }
  yield put(actionSettingsChange({ submitDisabled: false }))
}

function* processMFAVerify(action) {
  const { phoneVerificationTransactionId } = yield select(state => state.individualData)
  try {
    yield put(actionApplicationMFAStatusChange(FortifidConstants.WAITING));
    const result = yield call(API.getMFAStatus, phoneVerificationTransactionId);
    if (result.data.status.toUpperCase() === FortifidConstants.VERIFIED) {
      yield put(actionApplicationMFAStatusChange(FortifidConstants.VERIFIED));
      yield put(actionApplicationStatusChange(ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST))
    } else if (result.data.status.toUpperCase() === FortifidConstants.EXPIRED) {
      yield put(actionApplicationMFAStatusChange(FortifidConstants.EXPIRED));
      yield put(actionApplicationStatusChange(ApplicationStatuses.SECURE_MFA_REQUEST))
      yield toast.warning(<ToastMessage id="applicationStatusPage.expiredLink" />)
    } else if (result.data.status.toUpperCase() === FortifidConstants.USED) {
      yield put(actionApplicationMFAStatusChange(FortifidConstants.EXPIRED));
    }
  } catch (e) {
    yield call(errorHandler, e)
  }
}

function* processDocumentRequest(action) {
  let body;
  yield put(actionSettingsChange({ submitDisabled: true }))
  const { applicationId } = yield select(state => state.applicationData)
  const applicationData = yield select(state => state.applicationData);
  const individualData = yield select(state => state.individualData);
  const existingCustomerData = yield select(state => state.existingCustomerData)

  let bodyNewUser = {
    "applicationId": applicationData.applicationId,
    "phone": individualData.mobilePhone
  }
  let bodyExistingUser = {
    "applicationId": applicationData.applicationId,
    "phone": existingCustomerData.personalData?.mobilePhone
  }
  if (applicationData.flowType !== "Existing Customer") {
    body = bodyNewUser;
  } else {
    body = bodyExistingUser;
  }
  try {
    yield call(API.sendDocumentVerificationRequest, body)
    yield put(actionApplicationStatusChange(ApplicationStatuses.DOCUMENT_VERIFICATION_VERIFY))
  } catch (e) {
    yield call(errorHandler, e)
  }
  yield put(actionSettingsChange({ submitDisabled: false }))
}

function* processDocumentVerify(action) {
  const { applicationId } = yield select(state => state.applicationData)
  const { financialAccountType } = yield select(state => state.individualData)
  try {
    const result = yield call(API.getDocumentVerificationStatus, applicationId);
    let status = result.data.application.status.toUpperCase();
    
    console.log("proof of identity", status);

    if (status === FortifidConstants.COMPLETED) {
      const nextStatus =
        financialAccountType === FinancialAccountTypes.none
          ? ApplicationStatuses.INCOME_INSIGHTS
          : ApplicationStatuses.INCOME_BANK_VERIFICATION_REQUEST
      yield put(actionApplicationStatusChange(nextStatus))
    } else if (status === FortifidConstants.EXPIRED) {
      yield put(actionApplicationStatusChange(ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST))
      yield toast.warning(<ToastMessage id="applicationStatusPage.expiredLink" />)
    } else if (status === FortifidConstants.FAILED) {
      yield put(actionApplicationStatusChange(ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST))
      yield toast.error(<ToastMessage id="applicationStatusPage.steps.identity.failed" />)
    }
  } catch (e) {
    console.log(e);
    yield call(errorHandler, e)
  }
}

function* processIncomeRequest(action) {
  let body;
  let requestType;

  yield put(actionSettingsChange({ submitDisabled: true }))
  const applicationData = yield select(state => state.applicationData)
  const individualData = yield select(state => state.individualData)
  const existingCustomerData = yield select(state => state.existingCustomerData)

  if (action.payload.request_type === "sms") {
    requestType = "sms"
    body = {
      "method": "phone",
      "applicationId": applicationData.applicationId,
      "phone": applicationData.flowType !== "Existing Customer" ? individualData.mobilePhone : existingCustomerData.personalData?.mobilePhone
    }
  } else if (action.payload.request_type === "email") {
    requestType = "email"
    body = {
      "method": "email",
      "applicationId": applicationData.applicationId,
      "email": applicationData.flowType !== "Existing Customer" ? individualData.emailAddress : existingCustomerData.personalData?.emailAddress
    }
  }
  try {
    yield call(API.sendBankVerificationRequest, applicationData.applicationId, body)
    yield put(actionApplicationStatusChange(ApplicationStatuses.INCOME_BANK_VERIFICATION_VERIFY))
  } catch (e) {
    yield call(errorHandler, e)
  }
  yield put(actionSettingsChange({ submitDisabled: false }))
}

function* processIncomeVerify(action) {
  const { applicationId } = yield select(state => state.applicationData)
  try {
    const result = yield call(API.getBankVerificationStatus, applicationId);
    let status = result.data.application.status.toUpperCase();
    
    console.log("proof of income", status);
    
    if (status === FortifidConstants.COMPLETED) {
      yield put(actionApplicationStatusChange(ApplicationStatuses.INCOME_INSIGHTS))
    } else if (status === FortifidConstants.EXPIRED) {
      yield put(actionApplicationStatusChange(ApplicationStatuses.INCOME_BANK_VERIFICATION_REQUEST))
      yield toast.warning(<ToastMessage id="applicationStatusPage.expiredLink" />)
    }
  } catch (e) {
    yield call(errorHandler, e)
  }
}

function* processIncomeInsightsRequest(action) {
  const { applicationId } = yield select(state => state.applicationData)
  try {
    yield call(API.getIncomeInsights, applicationId)
    yield put(actionApplicationStatusChange(ApplicationStatuses.SEND_EMAIL_COMPLETE))
  } catch (e) {
    yield call(errorHandler, e)
  }
}

function* processVerifyReturnLink(action) {
  let applicationDataObj;
  let values;
  yield put(actionSettingsChange({ submitDisabled: true }))
  try {
    const response = yield call(API.verifyReturnLink, action.payload);
    values = response.data[0];
    if(values.decision != "No Action" && values.decision_reason != ""){
      yield toast.error(<ToastMessage id="globalMessages.cannotPerformOperation" />);
      return;
    }
    applicationDataObj = {
      "loanType": values?.type,
      "flowType": values?.type,
      "loanAmount": values?.loan_information.request_amount,
      "loanPurpose": values?.loan_information.purpose,
      "applicationId": values?.app_id,
      "existingCustmerTypes": true
    }
    localStorage.setItem("app_id", values?.app_id);
    localStorage.setItem("loan_information_id", values?.loan_information_id);
    yield put(actionApplicationDataUpdate(applicationDataObj));
    // add phone number and email in individualData state
    yield put(actionIndividualDataUpdate({ mobilePhone: values?.personal_information.phone, emailAddress: values?.personal_information.email }));
    yield navigate("/applicationstatus")
  } catch (e) {
    if (e.response && e.response.status === StatusCodes.FORBIDDEN) {
      yield toast.error(<ToastMessage id="globalMessages.linkVerificationError" />)
    } else {
      yield toast.error(<ToastMessage id="globalMessages.getExistingDataError" />)
    }
  }
  yield put(actionSettingsChange({ submitDisabled: false }))
}

function* processFillCoApplicantDataRequest(action) { //--------------
  let individualDataObject;
  individualDataObject = {
    coApplicationFirstName: action.payload.first_name,
    coApplicationMiddleName: action.payload.middle_name,
    coApplicationLastName: action.payload.last_name,
    coApplicationEmailAddress: action.payload.email,
    coApplication: action.payload.coApplicationNew === false ? false : true,
    coApplicant: action.payload.coApplicantNew === false ? false : true,
  }
  yield put(actionIndividualDataUpdate(individualDataObject));

}

function* processFillDemoDataRequest(action) { // -----
  let individualDataObj = {
    firstName: action.payload.first_name,
    middleName: action.payload.middle_name,
    lastName: action.payload.last_name,
    emailAddress: action.payload.email,
    coApplicant: action.payload.coApplicant,
    coApplication: action.payload.coApplication,
    mobilePhone: action.payload.phone,
    federalIdNumber: action.payload.ssn,
    birthDate: action.payload.dob,
    isUSCitizen: action.payload.is_us_citizen,
    driversLicenseState: action.payload.state_issue,
    driversLicenseExpireDate: action.payload.exp_date,
    driversLicenseNumber: action.payload.dl_number,
    addressStreet: action.payload.address,
    addressCity: action.payload.city,
    addressState: action.payload.state,
    addressZip: action.payload.zip,
    addressYears: action.payload.years_live_period,
    addressMonths: action.payload.months_live_period,
    addressLivePeriod: action.payload.live_period,
    formerAddressStreet: action.payload.address,
    formerAddressCity: action.payload.city,
    formerAddressState: action.payload.state,
    formerAddressZip: action.payload.zip,
    homeRentOrOwn: action.payload.property_use_type,
    homeMonthlyRentMortgage: action.payload.monthly_rent || action.payload.mortgage,
    homeAdditionalDetails: action.payload.note,
    homeIsFullyOwnedNoMortgage: action.payload.is_fully_own,
    financialBankName: action.payload.bank_name,
    financialAccountType: action.payload.account_type,
    financialCreditCardCashAdvStatus: action.payload.cash_advance,
    incomeSource: action.payload.income_type,
    incomeIndividualAnnualGross: action.payload.annual_income,
    incomeHouseholdAnnualGross: action.payload.household_income,
    netIncome: action.payload.net_income,
    incomeHasDirectDeposit: action.payload.isDirectDeposite,
    employmentEmployerName: action.payload.name,
    employmentAddressState: action.payload.emp_state,
    employmentPhoneNumber: action.payload.phone,
    employmentJobTitle: action.payload.job_title,
    employmentMonths: action.payload.months_length,
    employmentYears: action.payload.years_length,
    employmentAddressStreet: action.payload.address,
    employmentAddressCity: action.payload.city,
    employmentStatus: action.payload.emp_status,
    employmentAddressZip: action.payload.zip,
  }
  let businessDataObj = {
    businessType: action.payload.business_type,
    typeOfOwnership: action.payload.owner_type,
    companyName: action.payload.company,
    federalIdNumberType: action.payload.federal_number_type,
    federalIdNumber: action.payload.federal_number,
    webSite: action.payload.website,
    addressStreet: action.payload.address,
    addressCity: action.payload.city,
    addressState: action.payload.state,
    registrationState: action.payload.registration_state,
    addressZip: action.payload.zip,
    phoneNumber: action.payload.business_phone,
    dateEstablished: action.payload.date_established
  }

  let applicationDataObj = {
    loanAmount: action.payload.loanAmount,
    loanPurpose: action.payload.loanPurpose,
  }

  yield put(actionIndividualDataUpdate(individualDataObj));
  yield put(actionBusinessDataUpdate(businessDataObj))
  yield put(actionApplicationDataUpdate(applicationDataObj))


}

function* processFillExistingDemoDataRequest(action) {
  let applicationDataObj = {
    loanAmount: action.payload.loanAmount,
    loanPurpose: action.payload.loanPurpose,
    federalIdNumber: action.payload.ssn,
    birthDate: action.payload.dob,
    addressZip: action.payload.zip,
  }
  yield put(actionApplicationDataUpdate(applicationDataObj));

  // update existingCustomerData State
  let personalInfo = action.payload;
  let residentialAddress = {...action.payload, months: action.payload.months_live_period, years: action.payload.years_live_period};
  let formerAddress = action.payload;
  let employmentInfo = {...action.payload, months: action.payload.months_length, years: action.payload.years_length, length: 60, status: action.payload.emp_status};
  let incomeInfo = action.payload;
  let bankInfo = action.payload;
  let businessInfo = action.payload.type === LOAN_TYPES.small_business ? action.payload : null;
  const body = processExistingCustomerData(personalInfo, residentialAddress, formerAddress, employmentInfo, incomeInfo, bankInfo, businessInfo);
  yield put(actionUpdateExistingCustomerData(body));
}

function* processChangeDemoModeRequest(action) {
  let obj = {
    "isDemoMode": action.payload
  }
  yield put(actionIndividualDataUpdate(obj));
}

function* processFillExistingCoApplicationRequest(action) {
  let applicationDataObj = {
    loanAmount: action.payload.loanAmount,
    loanPurpose: action.payload.loanPurpose,
    coApplicationFirstName: action.payload.first_name,
    coApplicationMiddleName: action.payload.middle_name,
    coApplicationLastName: action.payload.last_name,
    coApplicationEmailAddress: action.payload.email,
    coApplication: action.payload.coApplicationNew === false ? false : true,
    coApplicant: action.payload.coApplicantNew === false ? false : true
  }
  yield put(actionApplicationDataUpdate(applicationDataObj));
}

function* processGetVerificationIdRequest(action) {
  let individualDataObject;
  individualDataObject = {
    "phoneVerificationTransactionId": action.payload
  }
  yield put(actionIndividualDataUpdate(individualDataObject));
}

function* processTempMFARequest(action) {
  const applicationData = yield select(state => state.applicationData)
  try {
    const result = yield call(API.getTempMFAStatus);
    if (result.data.status === "Completed") {
      yield put(actionApplicationStatusChange(ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST))
    } else if (result.data.status.toUpperCase() === FortifidConstants.EXPIRED) {
      yield put(actionApplicationStatusChange(ApplicationStatuses.SECURE_MFA_REQUEST))
      yield toast.warning(<ToastMessage id="applicationStatusPage.expiredLink" />)
    }
  } catch (e) {
    console.log(e);
    yield call(errorHandler, e)
  }
}

function* processDemoPhoneNoChangeRequest(action) {
  try {
    const applicationData = yield select(state => state.applicationData);
    let body = {
      "demoMobileNo": action.payload.demoMobileNo,
      "applicationId": applicationData.applicationId,
    }
    const result = yield call(API.demoPhoneNoChangeRequest, applicationData.applicationId, body);
    if (result.data.success === true) {
      if (applicationData.flowType !== "Existing Customer") {
        yield put(actionIndividualDataUpdate({ "mobilePhone": action.payload.demoMobileNo }));
      } else {
        yield put(actionUpdateExistingCustomerPersonalData({ "mobilePhone": action.payload.demoMobileNo }))
      }
      yield toast.success(<ToastMessage id="globalMessages.demoPhoneNoUpdated" />)
      //  Handle the error  
      //  yield put(actionIndividualDataUpdate({ "hidePhoneEditModal": false }));      
    } else {
      yield toast.error(<ToastMessage id="globalMessages.submissionError" />)
    }
  } catch (e) {
    console.log(e);
    yield call(errorHandler, e)
  }
}

function* getOrganizationListRequest() {
  try {
    const result = yield call(API.getOrganizationList);
    const applicationDataObj = {
      organizationList: result.data?.organizations || []
    }
    yield put(actionApplicationDataUpdate(applicationDataObj));
  } catch (error) {
    console.log(error);
  }
}

export const processDataBeforeSubmit = (businessData, personalData, coApplicantData, addressData, incomeData, loanData, employmentData, organizationId=null) => {
  let personalInfoFormBody = {
    "first_name": personalData.firstName,
    "middle_name": personalData.middleName,
    "last_name": personalData.lastName,
    "phone": personalData.mobilePhone,
    "email": personalData.emailAddress,
    "ssn": personalData.federalIdNumber,
    "dob": personalData.birthDate,
    "is_us_citizen": personalData.isUSCitizen,
    "state_issue": personalData.driversLicenseState,
    "exp_date": personalData.driversLicenseExpireDate,
    "dl_number": personalData.driversLicenseNumber,
  }

  let coappFormBody = {
    "co_application": coApplicantData.coApplication,
    "first_name_coapplication": coApplicantData.coApplicationFirstName,
    "middle_name_coapplication": coApplicantData.coApplicationMiddleName,
    "last_name_coapplication": coApplicantData.coApplicationLastName,
    "email_coapplication": coApplicantData.coApplicationEmailAddress
  }

  let addressFormBody = {
    "address": addressData.addressStreet,
    "city": addressData.addressCity,
    "state": addressData.addressState,
    "zip": addressData.addressZip,
    "live_period": addressData.addressLivePeriod,
    "address_option": addressData.addressAptSuiteNumber,
    "property_use_type": addressData.homeRentOrOwn,
    "monthly_rent": addressData.homeMonthlyRentMortgage,
    "mortgage": addressData.homeMonthlyRentMortgage,
    "note": addressData.homeAdditionalDetails,
    "is_fully_own": addressData.homeIsFullyOwnedNoMortgage
  }

  let formerAddressFormBody= {
    "address": addressData.formerAddressStreet,
    "city": addressData.formerAddressCity,
    "state": addressData.formerAddressState,
    "zip": addressData.formerAddressZip,
    "live_period": addressData.formerAddressLivePeriod,
    "address_option": addressData.formerAddressAptSuiteNumber
  }

  let bankInfoFormBody = {
    "bank_name": `${incomeData.financialBankName}`,
    "account_type": `${incomeData.financialAccountType}`,
    "cash_advance": `${incomeData.financialCreditCardCashAdvStatus}`
  }

  let incomeInfoFormBody = {
    "income_type": `${incomeData.incomeSource}`,
    "annual_income": `${incomeData.incomeIndividualAnnualGross}`,
    "household_income": `${incomeData.incomeHouseholdAnnualGross}`,
    "net_income": `${incomeData.netIncome}`,
  }

  let employmentInfoFormBody = {
    "status": `${employmentData.employmentStatus}`,
    "name": `${employmentData.employmentEmployerName}`,
    "phone": `${employmentData.employmentPhoneNumber}`,
    "job_title": `${employmentData.employmentJobTitle}`,
    "length": `${employmentData.employmentLength}`,
    "address": `${employmentData.employmentAddressStreet}`,
    "city": `${employmentData.employmentAddressCity}`,
    "state": `${employmentData.employmentAddressState}`,
    "zip": `${employmentData.employmentAddressZip}`,
    "address_option": `${employmentData.employmentAddressAptSuiteNumber}`
  }

  const loanInfoFormBody = {
    "type": loanData.loanType,
    "request_amount": loanData.loanAmount,
    "purpose": loanData.loanPurpose
  }

  let businessInfoFormBody = {
    "business_type": `${businessData.businessType}`,
    "owner_type": `${businessData.typeOfOwnership}`,
    "company": `${businessData.companyName}`,
    "federal_number_type": `${businessData.federalIdNumberType?.toLowerCase()}`,
    "federal_number": `${businessData.federalIdNumber}`,
    "website": `${businessData.webSite}`,
    "address": `${businessData.addressStreet}`,
    "city": `${businessData.addressCity}`,
    "state": `${businessData.addressState}`,
    "registration_state": `${businessData.registrationState}`,
    "zip": `${businessData.addressZip}`,
    "phone": `${businessData.phoneNumber}`,
    "date_established": `${businessData.dateEstablished}`,
    "business_identity": `${businessData.doingBusinessAs}`,
    "address_option": `${businessData.addressAptSuiteNumber}`,
  }

  // co applicant return case
  let userDetails = {
    "userDetail": {
      "id": personalData.id,
      "app_id": personalData.app_id,
      "main_app_id": personalData.main_app_id
    },
    "coApplicantReturnFlow": personalData.coApplicantReturnFlow,
    "business_information": null,
    "loan_information": null,
    "coapp_information": null
  }

  let body = {
    personal_information: personalInfoFormBody,
    loan_information: loanInfoFormBody,
    residential_address: addressFormBody,
    income_information: incomeInfoFormBody,
    bank_information: bankInfoFormBody,
    employment_information: employmentInfoFormBody,
    business_information: loanData.loanType === LOAN_TYPES.small_business ? businessInfoFormBody : null,
    former_address: addressData.addressLivePeriod < FORMER_ADDRESS_THRESHOLD ? formerAddressFormBody : null,
    coapp_information: coappFormBody,
    ...(personalData.coApplicantReturnFlow && userDetails),
    ...(organizationId && {organization_id: organizationId})
  }
  return body;
}

export const processExistingCustomerData = (personalInfo, residentialAddress, formerAddress, employmentInfo, incomeInfo, bankInfo, businessInfo ) => {
  let personalInfoObject = {};
  let residentialAddressObject = {};
  let formerAddressObject = {};
  let employmentInfoObject = {};
  let incomeInfoObject = {};
  let bankInfoObject = {};
  let businessInfoObject = {};
  //let coapplicantInfoObject = {};

  if (objectExists(personalInfo)) {
    personalInfoObject = {
      firstName: personalInfo.first_name,
      middleName: personalInfo.middle_name || '',
      lastName: personalInfo.last_name,
      birthDate: moment(personalInfo.dob).format("MM/DD/YYYY"),
      federalIdNumber: personalInfo.ssn,
      emailAddress: personalInfo.email,
      driversLicenseNumber: personalInfo.dl_number,
      driversLicenseExpireDate: moment(personalInfo.exp_date).format("MM/DD/YYYY"),
      isUSCitizen: personalInfo.is_us_citizen ? true : false,
      mobilePhone: personalInfo.phone,
      driversLicenseState: personalInfo.state_issue,
    }
  }
  if (objectExists(residentialAddress)) {
    residentialAddressObject = {
      addressStreet: residentialAddress.address,
      addressCity: residentialAddress.city,
      addressState: residentialAddress.state,
      addressZip: residentialAddress.zip,
      homeRentOrOwn: titleCase(residentialAddress.property_use_type),
      homeMonthlyRentMortgage: Boolean(residentialAddress.is_fully_own)
        ? ""
        : residentialAddress.property_use_type.toLowerCase() ===
          OWNERSHIP_TYPES.other.toLowerCase()
        ? ""
        : residentialAddress.property_use_type.toLowerCase() ===
          OWNERSHIP_TYPES.rent.toLowerCase()
        ? String(residentialAddress.monthly_rent)
        : String(residentialAddress.mortgage),
      homeAdditionalDetails: residentialAddress.note,
      homeIsFullyOwnedNoMortgage: Boolean(
        residentialAddress.is_fully_own
      ),
      addressLivePeriod: residentialAddress.live_period,
      addressAptSuiteNumber: residentialAddress.address_option || '',
      addressYears: residentialAddress.years?.toString(),
      addressMonths: residentialAddress.months?.toString(),
    };
  }
  if (objectExists(formerAddress)) {
    formerAddressObject = {
      formerAddressAptSuiteNumber: formerAddress.address_option || '',
      formerAddressCity: formerAddress.city,
      formerAddressMonths: formerAddress.months,
      formerAddressYears: formerAddress.years,
      formerAddressState: formerAddress.state,
      formerAddressStreet: formerAddress.address,
      formerAddressZip: formerAddress.zip,
      formerAddressLivePeriod: formerAddress.live_period
    }
  }
  if (objectExists(employmentInfo)) {
    employmentInfoObject = {
      employmentAddressStreet: employmentInfo.address,
      employmentAddressCity: employmentInfo.city,
      employmentPhoneNumber: employmentInfo.phone,
      employmentAddressState: employmentInfo.state,
      employmentStatus: employmentInfo.status,
      employmentAddressZip: employmentInfo.zip,
      employmentEmployerName: employmentInfo.name,
      employmentJobTitle: employmentInfo.job_title,
      employmentLength: employmentInfo.length,
      employmentMonths: employmentInfo.length ? employmentInfo.months?.toString() : '',
      employmentYears: employmentInfo.length ? employmentInfo.years?.toString(): '',
      employmentAddressAptSuiteNumber: employmentInfo.address_option || ''
    }
  }
  if (objectExists(incomeInfo)) {
    incomeInfoObject = {
      incomeIndividualAnnualGross: typeof(incomeInfo.annual_income) === 'number' ? String(incomeInfo.annual_income) : incomeInfo.annual_income,
      incomeHouseholdAnnualGross: typeof(incomeInfo.household_income) === 'number' ? String(incomeInfo.household_income) : incomeInfo.household_income,
      incomeSource: incomeInfo.income_type,
      netIncome: typeof(incomeInfo.net_income) === 'number' ? String(incomeInfo.net_income) : incomeInfo.net_income,
    }
  }
  if (objectExists(bankInfo)) {
    bankInfoObject = {
      financialAccountType: bankInfo.account_type,
      financialBankName: bankInfo.bank_name,
      financialCreditCardCashAdvStatus: bankInfo.cash_advance,
    }
  }

  if (objectExists(businessInfo)) {
    businessInfoObject = {
      addressStreet: businessInfo.address,
      addressCity: businessInfo.city,
      doingBusinessAs: businessInfo.business_identity || '',
      phoneNumber: businessInfo.phone,
      addressState: businessInfo.state,
      businessType: businessInfo.business_type,
      addressZip: businessInfo.zip,
      typeOfOwnership: businessInfo.owner_type,
      companyName: businessInfo.company,
      webSite: businessInfo.website || '',
      dateEstablished: moment(businessInfo.date_established).format("MM/DD/YYYY"),
      registrationState: businessInfo.registration_state,
      federalIdNumber: businessInfo.federal_number,
      federalIdNumberType: businessInfo.federal_number_type?.toUpperCase(),
      addressAptSuiteNumber: businessInfo.address_option || '',
    }
  }

  // coapplicantInfoObject = {
  //   coApplication: applicationData.coApplication,
  //   coApplicant: applicationData.coApplicant,
  //   coApplicationFirstName: applicationData.coApplicationFirstName,
  //   coApplicationMiddleName: applicationData.coApplicationMiddleName,
  //   coApplicationLastName: applicationData.coApplicationLastName,
  //   coApplicationEmailAddress: applicationData.coApplicationEmailAddress,
  // }

  let body = {
    personalData: personalInfoObject,
    //coApplicantData: coapplicantInfoObject,
    addressData: {...residentialAddressObject, ...formerAddressObject},
    incomeData: {...incomeInfoObject, ...bankInfoObject},
    employmentData: employmentInfoObject,
    businessData: businessInfoObject,
  }
  return body;
}


function* watchSettingsLoadSaga() {
  yield takeEvery(SETTINGS_LOAD, loadSettings)
}

function* watchStartSaga() {
  yield takeEvery(APP_LOADED, startApplication)
}

function* watchRestartSaga() {
  yield takeEvery(FLOW_RESTART, restartAplication)
}

function* watchExistingCustomerInformation() {
  yield takeEvery(EXISTING_CUSTOMER_INFORMATION, existingCustomerInformation)
}

function* watchLoanDetail() {
  yield takeEvery(LOAN_DETAIL, loanDetail)
}
function* watchBusinessInfoForm() {
  yield takeEvery(BUSINESS_INFO_FORM, businessInfoForm)
}

function* watchBasicInformation() {
  yield takeEvery(BASIC_INFORMATION, basicInformation)
}

function* watchSSNForm() {
  yield takeEvery(SSN_FORM, ssnForm)
}

function* watchDLNForm() {
  yield takeEvery(DLN_FORM, dlnForm)
}

function* watchResidentialAddressForm() {
  yield takeEvery(RESIDENTIAL_ADDRESS_FORM, residentialAddressForm)
}
// function* watchFormalAddressForm() {
//   yield takeEvery(FORMAL_ADDRESS_FORM, formalAddressForm)
// }
function* watchIncomeHousingForm() {
  yield takeEvery(INCOME_HOUSING_FORM, incomeHousingForm)
}
function* watchIncomeAccountForm() {
  yield takeEvery(INCOME_ACCOUNT_FORM, incomeAccountForm)
}
function* watchIncomeInfoForm() {
  yield takeEvery(INCOME_INFO_FORM, incomeInfoForm)
}
function* watchEmploymentInfoForm() {
  yield takeEvery(EMPLOYMENT_INFO_FORM, employmentInfoForm)
}
function* watchPostExistingCustomerData() {
  yield takeEvery(POST_EXISTING_CUSTOMER_INFO, postExistingCustomerSummary)
}

function* watchPostSummaryInfoData() {
  yield takeEvery(POST_SUMMARY_INFO_FORM, postSummaryInfoData)
}

function* watchWebActivitySaga() {
  yield takeEvery(WEB_ACTIVITY, processWebActivity)
}

function* watchApplicationInitializeSaga() {
  yield takeEvery(APPLICATION_INITIALIZE, processApplicationInitialize)
}

function* watchCoApplicationDetailsSaga() {
  yield takeEvery(GET_COAPPLICANT_DETAILS, getCoApplicantDetails)
}

function* watchApplicationDataFormSubmit() {
  yield takeEvery(APPLICATION_DATA_FORM_SUBMIT, processApplicationDataFormSubmit)
}

function* watchIndividualDataFormSubmit() {
  yield takeEvery(INDIVIDUAL_DATA_FORM_SUBMIT, processIndividualDataFormSubmit)
}

function* watchExistingDataFormSubmit() {
  yield takeEvery(EXISTING_DATA_FORM_SUBMIT, processExistingDataFormSubmit)
}

function* watchBusinessDataFormSubmit() {
  yield takeEvery(BUSINESS_DATA_FORM_SUBMIT, processBusinessDataFormSubmit)
}

function* watchLoadApplicationStatus() {
  yield takeLatest(APPLICATION_STATUS_REQUEST, processApplicationStatusRequest)
}

function* watchConsumerInsightsRequest() {
  yield takeEvery(CONSUMER_INSIGHTS_REQUEST, processConsumerInsightsRequest)
}

function* watchBusinessInsightsRequest() {
  yield takeEvery(BUSINESS_INSIGHTS_REQUEST, processBusinessInsightsRequest)
}

function* watchMFARequest() {
  yield takeEvery(MFA_REQUEST, processMFARequest)
}

function* watchMFAVerify() {
  yield takeLatest(MFA_VERIFY, processMFAVerify)
}

function* watchDocumentRequest() {

  yield takeEvery(DOCUMENT_REQUEST, processDocumentRequest)
}

function* watchDocumentVerify() {
  yield takeEvery(DOCUMENT_VERIFY, processDocumentVerify)
}

function* watchIncomeRequest() {
  yield takeEvery(INCOME_REQUEST, processIncomeRequest)
}

function* watchIncomeVerify() {
  yield takeLatest(INCOME_VERIFY, processIncomeVerify)
}

function* watchIncomeInsightsRequest() {
  yield takeEvery(INCOME_INSIGHTS_REQUEST, processIncomeInsightsRequest)
}

function* watchVerifyReturnLink() {
  yield takeEvery(VERIFY_RETURN_LINK, processVerifyReturnLink)
}

function* watchSendRestoreEmailRequest() {
  yield takeEvery(SEND_RESTORE_EMAIL, processSendRestoreEmailRequest)
}

function* watchSendCompleteEmailRequest() {
  yield takeEvery(SEND_COMPLETE_EMAIL, processSendCompleteEmailRequest)
}

function* watchFillDemoData() {
  yield takeEvery(FILL_DEMO_DATA, processFillDemoDataRequest)
}

function* watchFilExistingDemoData() {
  yield takeEvery(FILL_EXISTING_DEMO_DATA, processFillExistingDemoDataRequest)
}

function* watchFillCoApplicantData() {
  yield takeEvery(FILL_CoApplicant_DATA, processFillCoApplicantDataRequest)
}

function* watchChangeDemoMode() {
  yield takeEvery(DEMO_MODE, processChangeDemoModeRequest)
}

function* watchFillExistingCoApplication() {
  yield takeEvery(FILL_EXISTING_COAPPLICANT, processFillExistingCoApplicationRequest)
}

function* watchGetPhoneVerificationId() {
  yield takeEvery(GET_PHONE_VERIFICATION_TRANSACTION_ID, processGetVerificationIdRequest)
}

function* watchTempMFA() {
  yield takeEvery(TEMP_MFA_VERIFY, processTempMFARequest)
}

function* watchDemoPhoneNoChangeRequestRequest() {
  yield takeEvery(DEMO_PHONE_NO_CHANGE_REQUEST, processDemoPhoneNoChangeRequest)
}

function* watchOrganizationListRequest() {
  yield takeEvery(GET_ORGANIZATION_LIST, getOrganizationListRequest)
}

function* rootSaga() {
  yield spawn(watchStartSaga)
  yield spawn(watchRestartSaga)
  yield spawn(watchSettingsLoadSaga)
  yield spawn(watchExistingCustomerInformation)
  yield spawn(watchLoanDetail)
  yield spawn(watchBusinessInfoForm)
  yield spawn(watchBasicInformation)
  yield spawn(watchSSNForm)
  yield spawn(watchDLNForm)
  yield spawn(watchResidentialAddressForm)
  // yield spawn(watchFormalAddressForm)
  yield spawn(watchIncomeHousingForm)
  yield spawn(watchIncomeAccountForm)
  yield spawn(watchIncomeInfoForm)
  yield spawn(watchEmploymentInfoForm)
  yield spawn(watchPostExistingCustomerData)
  yield spawn(watchPostSummaryInfoData)
  yield spawn(watchWebActivitySaga)
  yield spawn(watchCoApplicationDetailsSaga)
  yield spawn(watchApplicationInitializeSaga)
  yield spawn(watchApplicationDataFormSubmit)
  yield spawn(watchIndividualDataFormSubmit)
  yield spawn(watchExistingDataFormSubmit)
  yield spawn(watchBusinessDataFormSubmit)
  yield spawn(watchLoadApplicationStatus)
  yield spawn(watchConsumerInsightsRequest)
  yield spawn(watchBusinessInsightsRequest)
  yield spawn(watchSendRestoreEmailRequest)
  yield spawn(watchSendCompleteEmailRequest)
  yield spawn(watchMFARequest)
  yield spawn(watchMFAVerify)
  yield spawn(watchDocumentRequest)
  yield spawn(watchDocumentVerify)
  yield spawn(watchIncomeRequest)
  yield spawn(watchIncomeVerify)
  yield spawn(watchIncomeInsightsRequest)
  yield spawn(watchVerifyReturnLink)
  yield spawn(watchFillDemoData)
  yield spawn(watchFilExistingDemoData)
  yield spawn(watchFillCoApplicantData)
  yield spawn(watchChangeDemoMode)
  yield spawn(watchFillExistingCoApplication)
  yield spawn(watchGetPhoneVerificationId)
  yield spawn(watchTempMFA)
  yield spawn(watchDemoPhoneNoChangeRequestRequest)
  yield spawn(watchOrganizationListRequest)
}
export default rootSaga
