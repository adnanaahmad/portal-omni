import React, { Component } from "react"
import { connect } from "react-redux"
import { navigate } from "gatsby"
import {
  actionApplicationInitialize,
  actionApplicationDataFormSubmit,
  actionIndividualDataFormSubmit,
  actionBusinessDataFormSubmit,
  actionWebActivity,
  actionChangeDemoMode,
  actionFlowRestart
} from "components/state/actions"
import ProgressBar from "components/ProgressBar/ProgressBar"
import ContentBox from "components/Shared/ContentBox/ContentBox"

import GetStartedForm from "components/Forms/GetStartedForm/GetStartedForm"
import DisclaimerForm from "components/Forms/DisclaimerForm/DisclaimerForm"
import LoanDetailsForm from "components/Forms/LoanDetailsForm/LoanDetailsForm"
import BasicInfoForm from "components/Forms/BasicInfoForm/BasicInfoForm"
import BusinessInfoForm from "components/Forms/BusinessInfoForm/BusinessInfoForm"
import EmploymentInfoForm from "components/Forms/EmploymentInfoForm/EmploymentInfoForm"
import SSNForm from "components/Forms/SSNForm/SSNForm"
import DLNForm from "components/Forms/DLNForm/DLNForm"
import AddressInfoForm from "components/Forms/AddressInfoForm/AddressInfoForm"
import FormerAddressInfoForm from "components/Forms/FormerAddressInfoForm/FormerAddressInfoForm"
import IncomeHousingForm from "components/Forms/IncomeHousingForm/IncomeHousingForm"
import IncomeBankAccountsForm from "components/Forms/IncomeBankAccountsForm/IncomeBankAccountsForm"
import IncomeInformationForm from "components/Forms/IncomeInformationForm/IncomeInformationForm"
import SummaryInfoForm from "components/Forms/SummaryInfoForm/SummaryInfoForm"
import GovtDocScanningForm from "components/Forms/GovtDocScanningForm/GovtDocScanningForm"
import SubmitApplicationForm from "components/Forms/SubmitApplicationForm/SubmitApplicationForm"
import LOAN_TYPES from "data/LoanTypes"
import WEB_ACTIVITY_TYPES from "data/WebActivityTypes"
import { FORMER_ADDRESS_THRESHOLD } from "constants/common"

import FormNames from "constants/forms"
import ApplicationStatuses from "constants/applicationstates"
import LoadingAnimation from "components/LoadingAnimation/LoadingAnimation"

import "./FlowControlContainer.scss"
import YesOrNo from "../Forms/YesOrNoForm/YesOrNo"
import ExistingCustomerInfoForm from "../Forms/ExistingCustomerInfoForm/ExistingCustomerInfoForm"
import ExistingCustomerLoadingData from "../Forms/ExistingCustomerLoadingData/ExistingCustomerLoadingData"
import ExistingCustomerSummaryInfoForm from "../Forms/ExistingCustomerSummaryInfoForm/ExistingCustomerSummaryInfoForm"
import CoApplication from "../Forms/CoApplication/CoApplication"
import PhoneVerification from "../Forms/PhoneVerification/PhoneVerification"
import { actionExistingDataFormSubmit } from "../state/actions"
export const FORM_DATA_TYPES = {
  initialize: "initialize",
  application: "application",
  individual: "individual",
  business: "business",
  existing: "existing"
}



export const FLOWS = {
  [LOAN_TYPES.personal_loan]: [
    {
      name: FormNames.FORM_YES_OR_NO,
      component: YesOrNo,
      dataType: FORM_DATA_TYPES.application,
    },
    {
      name: FormNames.FORM_DISCLAIMER,
      component: DisclaimerForm,
      dataType: FORM_DATA_TYPES.application,
    },
    {
      name: FormNames.FORM_LOAN_DETAILS,
      component: LoanDetailsForm,
      dataType: FORM_DATA_TYPES.application,
    },
    // {
    //   name: FormNames.FORM_GOVT_DOCUMENT_SCANNING,
    //   component: GovtDocScanningForm,
    //   dataType: FORM_DATA_TYPES.application,
    // },
    {
      name: FormNames.FORM_BASIC_INFO,
      component: BasicInfoForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_SSN,
      component: SSNForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_DLN,
      component: DLNForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_ADDRESS,
      component: AddressInfoForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_INCOME_HOUSING,
      component: IncomeHousingForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_FORMER_ADDRESS,
      component: FormerAddressInfoForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_INCOME_BANK_ACCOUNTS,
      component: IncomeBankAccountsForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_INCOME_INFO,
      component: IncomeInformationForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_EMPLOYMENT_INFO,
      component: EmploymentInfoForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_SUMMARY_INFO,
      component: SummaryInfoForm,
      dataType: FORM_DATA_TYPES.individual,

    },
    {
      name: FormNames.SUBMIT_APPLICATION_FORM_LOADING,
      component: SubmitApplicationForm,
      dataType: FORM_DATA_TYPES.individual,
      isLastForm: true,
    },
  ],
  [LOAN_TYPES.small_business]: [
    {
      name: FormNames.FORM_YES_OR_NO,
      component: YesOrNo,
      dataType: FORM_DATA_TYPES.application,
    },
    {
      name: FormNames.FORM_DISCLAIMER,
      component: DisclaimerForm,
      dataType: FORM_DATA_TYPES.application,
    },
    {
      name: FormNames.FORM_LOAN_DETAILS,
      component: LoanDetailsForm,
      dataType: FORM_DATA_TYPES.application,
    },
    // {
    //   name: FormNames.FORM_GOVT_DOCUMENT_SCANNING,
    //   component: GovtDocScanningForm,
    //   dataType: FORM_DATA_TYPES.application,
    // },
    {
      name: FormNames.FORM_BUSINESS_INFO,
      component: BusinessInfoForm,
      dataType: FORM_DATA_TYPES.business,
    },
    {
      name: FormNames.FORM_BASIC_INFO,
      component: BasicInfoForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_SSN,
      component: SSNForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_DLN,
      component: DLNForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_ADDRESS,
      component: AddressInfoForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_INCOME_HOUSING,
      component: IncomeHousingForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_FORMER_ADDRESS,
      component: FormerAddressInfoForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_INCOME_BANK_ACCOUNTS,
      component: IncomeBankAccountsForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_INCOME_INFO,
      component: IncomeInformationForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_EMPLOYMENT_INFO,
      component: EmploymentInfoForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.FORM_SUMMARY_INFO,
      component: SummaryInfoForm,
      dataType: FORM_DATA_TYPES.individual,
    },
    {
      name: FormNames.SUBMIT_APPLICATION_FORM_LOADING,
      component: SubmitApplicationForm,
      dataType: FORM_DATA_TYPES.individual,
      isLastForm: true,
    },
  ],
  [LOAN_TYPES.existing_customer]: [
    {
      name: FormNames.FORM_YES_OR_NO,
      component: YesOrNo,
      dataType: FORM_DATA_TYPES.application,
    },
    {
      name: FormNames.FORM_EXISTING_CUSTOMER_INFORMATION,
      component: ExistingCustomerInfoForm,
      dataType: FORM_DATA_TYPES.application,
    },
    {
      name: FormNames.FORM_LOAN_DETAILS,
      component: LoanDetailsForm,
      dataType: FORM_DATA_TYPES.application,
    },
    {
      name: FormNames.FORM_EXISTING_CUSTOMER_LOADING_DATA,
      component: ExistingCustomerLoadingData,
      dataType: FORM_DATA_TYPES.existing,
    },
    {
      name: FormNames.FORM_EXISTING_CUSTOMER_SUMMARY,
      component: ExistingCustomerSummaryInfoForm,
      dataType: FORM_DATA_TYPES.existing,

    },
    {
      name: FormNames.SUBMIT_APPLICATION_FORM_LOADING,
      component: SubmitApplicationForm,
      dataType: FORM_DATA_TYPES.existing,
      isLastForm: true,
    }
  ]
}

let yesORnoCheck;
class FlowControlContainer extends Component {
  componentDidMount() {
    const { applicationData, applicationStatus } = this.props
    if (applicationStatus.status !== ApplicationStatuses.DATA_COLLECTION) {
      navigate("/applicationstatus")
    }
    if (!applicationData.flowType) {
      navigate(this.props.location.pathname + this.props.location.hash, { replace: true })
    }
  }

  onSubmit = (values, formName, dataType, isLastForm) => {
    const {
      location: { hash },
    } = this.props


    if (isLastForm) {
      values.submit = true
    }
    if (formName === FormNames.FORM_YES_OR_NO) {
      yesORnoCheck = values.existingCustmerTypes;
      values.flowType = !yesORnoCheck ? this.props.applicationData.loanType : LOAN_TYPES.existing_customer;
    }

    if (dataType === FORM_DATA_TYPES.initialize) {
      this.props.dispatch(actionApplicationInitialize(values, { formName, dataType, isLastForm }))
    } else if (dataType === FORM_DATA_TYPES.application) {
      this.props.dispatch(actionApplicationDataFormSubmit(values, { formName, dataType, isLastForm }))
    } else if (dataType === FORM_DATA_TYPES.individual) {
      this.props.dispatch(actionIndividualDataFormSubmit(values, { formName, dataType, isLastForm }))
    } else if (dataType === FORM_DATA_TYPES.business) {
      this.props.dispatch(actionBusinessDataFormSubmit(values, { formName, dataType, isLastForm }))
    } else if (dataType === FORM_DATA_TYPES.existing) {
      this.props.dispatch(actionExistingDataFormSubmit(values, { formName, dataType, isLastForm }))
    }

    this.props.dispatch(actionWebActivity(WEB_ACTIVITY_TYPES.end_page, hash))
  }

  onPrev = () => {
    const { applicationData, individualData, dispatch } = this.props
    const { hash } = this.props.location
    let currentStep = this.getStep(applicationData.flowType, hash)
    const formName = FLOWS[applicationData.flowType][currentStep].name
    if (!applicationData.flowType || currentStep < 1) {
      navigate("/")
    }

    if (formName === FormNames.FORM_INCOME_BANK_ACCOUNTS && individualData.addressLivePeriod >= FORMER_ADDRESS_THRESHOLD) {
      currentStep -= 1; // skip former address
    }
    
    if(formName === FormNames.FORM_EXISTING_CUSTOMER_SUMMARY)
    {
      currentStep -= 1 ;
    }

    if (formName === FormNames.FORM_BASIC_INFO && applicationData.coApplicant) {
      currentStep -= 1 // skip loan details
    }


    if (FLOWS[applicationData.flowType][currentStep - 1] !== undefined) {
      navigate(`#${FLOWS[applicationData.flowType][currentStep - 1].name}`)
    } else {
      dispatch(actionFlowRestart())
    }
  }

  onReview = () => {
    navigate(`#${FormNames.FORM_SUMMARY_INFO}`)
  }

  getStep = (flowType, hash) => {
    if (!hash || !flowType) {
      return -1
    }
    hash = hash.replace(/^#/, "")
    const result = FLOWS[flowType].findIndex(s => s.name === hash)
    return result
  }

  render() {
    const { applicationData } = this.props
    const { hash } = this.props.location
    let currentStep = this.getStep(applicationData.flowType, hash)

    let urlParam = hash.substring(1).split("/");

    if ((hash === "#coapplicant" || hash === `#coapplicant/${urlParam[urlParam.length - 1]}`) && currentStep === -1) {
      return (
        <CoApplication hash={hash} />
      )
    }

    if ((hash === "#phoneVerify" || hash === `#phoneVerify/${urlParam[urlParam.length - 1]}`) && currentStep === -1) {
      return (
        <PhoneVerification hash={hash} />
      )
    }


    if (hash === "#return") {
      navigate("/return");
    }

    if (!applicationData.flowType || currentStep === -1) {
      return (
        <ContentBox>
          <GetStartedForm hash={hash} onSubmit={values => this.onSubmit(values, FormNames.FORM_LOAN_TYPE, FORM_DATA_TYPES.initialize, false)} />
        </ContentBox>
      )
    }

    const { component: Form, name, dataType, isLastForm } = FLOWS[applicationData.flowType][currentStep]

    if (applicationData.flowType === LOAN_TYPES.existing_customer && currentStep !== 0) {
      currentStep = 1;    // Making the progress bar to point part 1
    }

    return (
      <div className="fortifid-idv">
        <ContentBox>
          {
            !(applicationData.flowType === LOAN_TYPES.existing_customer && currentStep === 0) &&
            <div className="row no-gutters justify-content-center">
              <div className="col-xs-16 col-lg-8">
                {
                  (hash.substring(1) !== FormNames.FORM_EXISTING_CUSTOMER_LOADING_DATA && hash.substring(1) !== FormNames.FORM_DISCLAIMER && hash.substring(1) !== FormNames.SUBMIT_APPLICATION_FORM_LOADING) &&
                  <ProgressBar percent={Math.max((1 / FLOWS[applicationData.flowType].length) * 100, 6)} partNumber={1} />
                }
              </div>
            </div>
          }
          <Form onSubmit={values => this.onSubmit(values, name, dataType, isLastForm)} onPrev={this.onPrev} onReview={this.onReview} isLastForm={isLastForm} />
          {applicationData.showLoading &&
            <div id="overlay">
              <div className="fortifid-form-loading">
                <LoadingAnimation />
              </div>
            </div>
          }
        </ContentBox>
      </div>
    )
  }
}

export default connect(state => ({
  applicationData: state.applicationData,
  individualData: state.individualData,
  businessData: state.businessData,
  settings: state.settings,
  applicationStatus: state.applicationStatus,
}))(FlowControlContainer)
