import axios from "axios"
import LOAN_TYPES from "data/LoanTypes"
import DEMO_TYPES from "data/DemoTypes"
import APIUrl from "../APIUrl"
import { clearLocalStorage } from "./Shared/helpers"

const MOCK = {
  fetchSettings: { "logoURL": "/ABCBank.svg", "primaryColor": "#ffffff", "secondaryColor": "", "externalContactPageURL": "https://fortifid.com/contact-us", "externalHelpPageURL": "https://fortifid.com/contact" },
  createApplication: { applicationId: "e27ff96b-17d1-4506-b5d1-fd7cbe0b7f7e", "individualData": {}, "businessData": {} },
  creditCardApplication: DEMO_TYPES.credit_card,
  personalLoanApplication: DEMO_TYPES.personal_loan,
  smallBusinessApplication: DEMO_TYPES.small_business,
  saveApplicationData: {},
  saveIndividualData: {},
  saveBusinessData: {},
  saveWebActivity: {},
  sendMFARequest: {},
  getMFAStatus: { applicationId: "e27ff96b-17d1-4506-b5d1-fd7cbe0b7f7e", "applicationData": {}, "individualData": {}, "businessData": {}, status: "mfa/verify" },
  sendDocumentVerificationRequest: {},
  getDocumentVerificationStatus: { applicationId: "e27ff96b-17d1-4506-b5d1-fd7cbe0b7f7e", "applicationData": {}, "individualData": {}, "businessData": {}, status: "document/verify" },
  sendBankVerificationRequest: {},
  getBankVerificationRequest: { applicationId: "e27ff96b-17d1-4506-b5d1-fd7cbe0b7f7e", "applicationData": {}, "individualData": {}, "businessData": {}, status: "bank/verify" },
  getApplicationState: { applicationId: "e27ff96b-17d1-4506-b5d1-fd7cbe0b7f7e", "applicationData": { "demoMode": true }, "individualData": {}, "businessData": {}, status: "mfa/request" },
}

const getMockData = (id) => {
  const data = MOCK[id];

  const response = { data: { "code": 200, "errors": [], "message": "OK", "success": true } };
  if (data) {
    response.data.data = data;
  }

  return response;
}

class Api {
  constructor() {
    this.instance = axios.create({
      // baseURL: typeof window !== "undefined" && window._env_ ? window._env_.GATSBY_API_URL : process.env.GATSBY_API_URL,
      baseURL: `${APIUrl.API_BACKEND_URL}`,
      timeout: 60000,
      headers: { Accept: "application/json" },
    })
    this.instance.interceptors.response.use(
      response => {
        if (response.headers["x-csrf-token"]) {
          this.instance.defaults.headers["x-csrf-token"] = response.headers["x-csrf-token"]
        }
        return response
      },
      function (error) {
        return Promise.reject(error)
      }
    )
  }

  fetchSettings = async () => {
    // const response = await this.instance.get("/settings")
    const response = getMockData('fetchSettings');
    return response.data.data
  }

  createApplication = async data => {
    //return await this.instance.post("/initialize", data)
    switch (data.demoType) {
      case LOAN_TYPES.credit_card:
        return getMockData('creditCardApplication');
      case LOAN_TYPES.personal_loan:
        return getMockData('personalLoanApplication');
      case LOAN_TYPES.small_business:
        return getMockData('smallBusinessApplication');
      default:
        return getMockData('createApplication');
    }
  }

  saveCoApplicantData = async data => {
    let response = await this.instance.get(`${APIUrl.API_BACKEND_URL}api/omni/coapplication-checkToken/${data}`);
    clearLocalStorage();
    return response;

  }

  saveApplicationData = async data => {
    //return await this.instance.post(`/application/${data.applicationId}`, data)
    return getMockData('saveApplicationData');
  }

  saveLoanFormApplicationData = async data => {
    if (localStorage.getItem("nextBtnHitLoanInfo")) {
      let body = {
        "request_amount": data.request_amount,
        "purpose": data.purpose,
      }
      let response = await this.instance.put(`${APIUrl.API_BACKEND_URL}api/omni/update-loan-info/${localStorage.getItem("app_id")}`, body);
      return response;
    } else {
      // return await this.instance.post(`api/omni/loan-info`, data)
      let response = await this.instance.post(`${APIUrl.API_BACKEND_URL}api/omni/loan-info`, data);
      if (response.status === 200) {
        clearLocalStorage();
        localStorage.setItem("app_id", response.data.app_id.app_id);
        localStorage.setItem("loan_information_id", response.data.app_id.loan_information_id);
        localStorage.setItem("nextBtnHitLoanInfo", true);
        return response;
      }
      // return getMockData('saveLoanFormApplicationData');
    }

  }

  getExistingCustomerInformation = async data => {
    let response = await this.instance.post(`${APIUrl.API_BACKEND_URL}api/omni/existing-application-summary`, data);
    return response;
  }

  // savePostExistingCustomerInformation = async data => {
  //   let response = await this.instance.post(`${APIUrl.API_BACKEND_URL}api/omni/submit-existing-user-app`, data);
  //   if ((response.status === 200) && (response.data.success === true)) {
  //     clearLocalStorage();
  //     localStorage.setItem("app_id", response.data.application.app_id);
  //     localStorage.setItem("loan_information_id", response.data.application.loan_information_id);
  //   }
  //   return response;
  // }

  savePostSummaryInfoData = async data => {
    let response = await this.instance.post(`${APIUrl.API_BACKEND_URL}api/omni/submit-form`, data);
    if ((response.status === 200) && (response.data.success === true)) {
      clearLocalStorage();
      localStorage.setItem("app_id", response.data.application.app_id);
      localStorage.setItem("loan_information_id", response.data.application.loan_information_id);
    }
    return response;
    // let response = await this.instance.post(`${APIUrl.API_BACKEND_URL}api/omni/submit-form`, data);
    // if (response.status === 200) {
    //   localStorage.removeItem("nextBtnHitBasicInfo");
    //   localStorage.removeItem("nextBtnHitSSNInfo");
    //   localStorage.removeItem("nextBtnHitDLNInfo");
    //   localStorage.removeItem("nextBtnHitResidentialAddressForm");
    //   localStorage.removeItem("nextBtnHitIncomeHousingForm");
    //   localStorage.removeItem("nextBtnHitIncomeAccountForm");
    //   localStorage.removeItem("nextBtnHitIncomeInfoForm");
    //   localStorage.removeItem("nextBtnHitEmployementInfoForm");
    //   localStorage.removeItem("nextBtnHitFormalAddressForm");
    // }
    // if (localStorage.getItem("nextBtnHitBusinessInfoForm")) {
    //   localStorage.removeItem("nextBtnHitBusinessInfoForm");
    // }
    // return response;
  }

  saveBasicInformationFormData = async data => {
    if (localStorage.getItem("nextBtnHitBasicInfo")) {
      let body = {
        "first_name": `${data.first_name}`,
        "middle_name": `${data.middle_name}`,
        "last_name": `${data.last_name}`,
        "phone": `${data.phone}`,
        "email": `${data.email}`,
        "loan_information_id": `${data.loan_information_id}`,
      }
      let coapp = {};
      if (data.co_application) {
        coapp = {
          "co_application": data.co_application,
          "first_name_coapplication": `${data.first_name_coapplication}`,
          "middle_name_coapplication": `${data.middle_name_coapplication}`,
          "last_name_coapplication": `${data.last_name_coapplication}`,
          "email_coapplication": `${data.email_coapplication}`
        };
      }
      let response = await this.instance.put(`api/omni/update-basic-info/${localStorage.getItem("app_id")}`, {...body, ...coapp});
      return response;
    } else {
      let response = await this.instance.post(`api/omni/basic-info`, data);
      if (response.status === 200) {
        localStorage.setItem("nextBtnHitBasicInfo", true);
      }
      return response;
    }

  }

  saveSSNFormData = async data => {
    if (localStorage.getItem("nextBtnHitSSNInfo")) {
      let body = {
        "ssn": `${data.ssn}`,
        "dob": `${data.dob}`,
        "is_us_citizen": `${data.is_us_citizen}`
      }
      let response = await this.instance.put(`api/omni/update-ssn-info/${localStorage.getItem("app_id")}`, body);
      return response;

    } else {
      let response = await this.instance.post(`api/omni/ssn-info`, data);
      if (response.status === 200) {
        localStorage.setItem("nextBtnHitSSNInfo", true);
      }
      return response;
    }

  }
  saveDLNFormData = async data => {
    if (localStorage.getItem("nextBtnHitDLNInfo")) {
      let body = {
        "state_issue": `${data.state_issue}`,
        "exp_date": `${data.exp_date}`,
        "dl_number": `${data.dl_number}`,
      }
      let response = await this.instance.put(`api/omni/update-driver-license/${localStorage.getItem("app_id")}`, body);
      return response;
    } else {
      let response = await this.instance.post(`api/omni/driver-license`, data);
      if (response.status === 200) {
        localStorage.setItem("nextBtnHitDLNInfo", true);
      }
      return response;
    }


  }

  saveResidentialAddressForm = async data => {
    if (localStorage.getItem("nextBtnHitResidentialAddressForm")) {
      let body = {
        "address": `${data.address}`,
        "city": `${data.city}`,
        "state": `${data.state}`,
        "zip": `${data.zip}`,
        "live_period": `${data.live_period}`,
        "address_option": `${data.address_option}`
      }
      let response = await this.instance.put(`api/omni/update-residential-address/${localStorage.getItem("app_id")}`, body);
      return response;
    } else {
      let response = await this.instance.post(`api/omni/residential-address`, data);
      if (response.status === 200) {
        localStorage.setItem("nextBtnHitResidentialAddressForm", true);
      }
      return response;
    }

  }
  saveFormerAddressForm = async data => {
    if (localStorage.getItem("nextBtnHitFormalAddressForm")) {
      let body = {
        "address": `${data.address}`,
        "city": `${data.city}`,
        "state": `${data.state}`,
        "zip": `${data.zip}`,
        "live_period": `${data.live_period}`,
        "address_option": `${data.address_option}`
      }
      let response = await this.instance.put(`api/omni/update-formal-address/${localStorage.getItem("app_id")}`, body);
      return response;
    } else {
      let response = await this.instance.post(`api/omni/formal-address`, data);
      if (response.status = 200) {
        localStorage.setItem("nextBtnHitFormalAddressForm", true);
      }
      return response;
    }

  }
  saveIncomeHousingForm = async data => {
    if (localStorage.getItem("nextBtnHitIncomeHousingForm")) {
      let body = {
        "property_use_type": data.property_use_type,
        "mortgage": data.mortgage,
        "monthly_rent": data.monthly_rent,
        "is_fully_own": data.is_fully_own,
        "note": data.note
      }
      let response = await this.instance.put(`api/omni/incomehousing-form-update/${localStorage.getItem(("app_id"))}`, body);
      return response;
    } else {

      let response = await this.instance.post(`api/omni/incomehousing-form`, data);
      if (response.status === 200) {
        localStorage.setItem("nextBtnHitIncomeHousingForm", true);
      }
      return response;
    }

  }
  saveIncomeAccountForm = async data => {
    if (localStorage.getItem("nextBtnHitIncomeAccountForm")) {
      let body = {
        "bank_name": `${data.bank_name}`,
        "account_type": `${data.account_type}`,
        "cash_advance": `${data.cash_advance}`
      }
      let response = await this.instance.put(`api/omni/update-banking-info/${localStorage.getItem("app_id")}`, body);
      return response;
    } else {
      let response = await this.instance.post(`api/omni/banking-info`, data);
      if (response.status === 200) {
        localStorage.setItem("nextBtnHitIncomeAccountForm", true);
      }
      return response;
    }

  }
  saveIncomeInfoForm = async data => {
    if (localStorage.getItem("nextBtnHitIncomeInfoForm")) {
      let body = {
        "income_type": `${data.income_type}`,
        "annual_income": `${data.annual_income}`,
        "household_income": `${data.household_income}`,
        "net_income": `${data.net_income}`,
      }
      let response = await this.instance.put(`api/omni/update-income-info/${localStorage.getItem("app_id")}`, body);
      return response;
    } else {
      let response = await this.instance.post(`api/omni/income-info`, data)
      if (response.status === 200) {
        localStorage.setItem("nextBtnHitIncomeInfoForm", true);
      }
      return response;
    }
  }

  saveEmploymentInfoForm = async data => {
    if (localStorage.getItem("nextBtnHitEmployementInfoForm")) {
      let body = {
        "status": `${data.status}`,
        "name": `${data.name}`,
        "phone": `${data.phone}`,
        "job_title": `${data.job_title}`,
        "length": `${data.length}`,
        "address": `${data.address}`,
        "city": `${data.city}`,
        "state": `${data.state}`,
        "zip": `${data.zip}`,
        "address_option": `${data.address_option}`
      }
      let response = await this.instance.put(`api/omni/update-employment-info/${localStorage.getItem("app_id")}`, body);
      return response;
    } else {
      let response = await this.instance.post(`api/omni/employment-info`, data)
      if (response.status === 200) {
        localStorage.setItem("nextBtnHitEmployementInfoForm", true);
      }
      return response;
    }
  }

  saveIndividualData = async data => {
    //return await this.instance.post(`/individual/${data.applicationId}`, data)
    return getMockData('saveIndividualData');
  }

  saveBusinessData = async data => {
    if (localStorage.getItem("nextBtnHitBusinessInfoForm")) {
      let body = {
        "business_type": `${data.business_type}`,
        "owner_type": `${data.owner_type}`,
        "company": `${data.company}`,
        "federal_number_type": `${data.federal_number_type}`,
        "federal_number": `${data.federal_number}`,
        "website": `${data.website}`,
        "address": `${data.address}`,
        "city": `${data.city}`,
        "state": `${data.state}`,
        "registration_state": `${data.registration_state}`,
        "zip": `${data.zip}`,
        "phone": `${data.phone}`,
        "date_established": `${data.date_established}`,
        "business_identity": `${data.business_identity}`,
        "address_option": `${data.address_option}`,
      }
      let response = await this.instance.put(`api/omni/update-Business-info/${localStorage.getItem("app_id")}`, body);
      return response;
    } else {
      let response = await this.instance.post(`/api/omni/Business-info`, data);
      if (response.status === 200) {
        localStorage.setItem("nextBtnHitBusinessInfoForm", true);
      }
      return response;
    }



    // return getMockData('saveBusinessData');
  }

  saveWebActivity = async data => {
    //return await this.instance.post(`/webactivity/${data.applicationId}`, data)
    return getMockData('saveWebActivity');
  }

  getConsumerInsights = async applicationId => {
    return await this.instance.get(`/identityverification/consumerinsights/${applicationId}`)
  }

  getBusinessInsights = async applicationId => {
    return await this.instance.get(`/identityverification/businessinsights/${applicationId}`)
  }

  getIncomeInsights = async applicationId => {
    return await this.instance.post(`api/omni/application/${applicationId}/income-insights/`)
  }

  sendMFARequest = async data => {
    // return await this.instance.get(`/identityverification/mfa/request/${applicationId}`)
    // return getMockData('sendMFARequest');
    let response = await this.instance.post(`api/omni/mfa-verification/${data.applicationId}`, { "phone": data.phone });
    return response;
  }


  getMFAStatus = async transactionId => {
    let response = await this.instance.post(`api/omni/mfa-phone-verify/${transactionId}`);
    return response;
    // return getMockData('getMFAStatus');
  }

  getTempMFAStatus = async (data) => {
    let response = await this.instance.get(`${APIUrl.API_BACKEND_URL}api/omni/mfa-checkstatus?app_id=${localStorage.getItem("app_id")}`);
    return response;
  }

  sendDocumentVerificationRequest = async data => {
    let response = await this.instance.post(`api/omni/doc-verification/${data.applicationId}`, { "phone": data.phone });
    return response;
  }

  getDocumentVerificationStatus = async applicationId => {
    let response = await this.instance.post(`api/omni/checkdoc-verification/${applicationId}`)
    return response;
    // return getMockData('getDocumentVerificationStatus');
  }

  sendBankVerificationRequest = async (applicationId, request_type) => {
    let response = await this.instance.post(`api/omni/direct-id-get/${applicationId}`, request_type )
    //return await this.instance.get(`/identityverification/bank/request/${applicationId}`, { params: { request_type } })
    // return getMockData('sendBankVerificationRequest');
    return response;
  }

  getBankVerificationStatus = async applicationId => {
    return await this.instance.post(`api/omni/direct-id-get-check/${applicationId}`)
    // return await this.instance.get(`/identityverification/bank/verify/${applicationId}`)
   //  return getMockData('getBankVerificationRequest');
  }

  verifyReturnLink = async data => {
    let response = await this.instance.post(`api/omni/existing-application`, data);
    return response;
    // return await this.instance.post(`/restore/${data.applicationId}`, data)
  }

  getApplicationState = async applicationId => {
    return await this.instance.get(`/api/omni/get-application-state/${applicationId}`)
    //return getMockData('getApplicationState');
  }

  _sendEmail = async (applicationId, type) => {
    return await this.instance.post(`api/omni/sendEmail/${applicationId}`, null, { params: { type } })
  }

  sendRestoreEmail = async data => {
    let response = await this.instance.post(`api/omni/resend-code`, data);
    return response;
  }

  sendCompleteEmail = async applicationId => {
    return await this._sendEmail(applicationId, "complete")
  }

  demoPhoneNoChangeRequest = async (applicationId, request_type) => {
    let response = await this.instance.post(`api/omni/demo-phone-no-change/${applicationId}`, request_type);
    
    return response;
  }

  getOrganizationList = async () => {
    let response = await this.instance.get(`${APIUrl.API_BACKEND_URL}api/omni/get-demo-organizations`);
    return response;
  }
}

const apiInstance = new Api()

export default apiInstance
