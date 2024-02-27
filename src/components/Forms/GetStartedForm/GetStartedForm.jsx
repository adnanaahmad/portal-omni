import React, { Component } from "react"
import { connect } from "react-redux"
import { navigate } from "gatsby"
import { Form, FormSpy } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import FormField, { FIELD_TYPES } from "components/Shared/Form/FormField/FormField"
import { FormFieldsWrapper, FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import PageHeading from "components/PageHeading/PageHeading"
import LOAN_TYPES from "data/LoanTypes"
import LoanCreditCardIcon from "static/images/loan-credit-card-icon.svg"
import LoanPersonalIcon from "static/images/loan-personal-icon.svg"
import LoanSmallBusinessAndEquipmentIcon from "static/images/loan-small-business-and-equipment-icon.svg"
import { OnChange } from "react-final-form-listeners"
import { actionApplicationInitialize, actionSettingsChange } from "components/state/actions"
import "./GetStartedForm.scss"
import { actionChangeDemoMode, actionToggleStartOverButton } from "../../state/actions"
import { clearLocalStorage } from "../../Shared/helpers"
import OrganizationDropdown from "../../Dropdown/OrganizationDropdown/OrganizationDropdown"

class GetStartedForm extends Component {
  submit = values => {
    clearLocalStorage();
    values.flowType = LOAN_TYPES.existing_customer;
    this.props.onSubmit(values)
  }

  componentDidMount() {
    const { hash } = this.props;
    this.props.dispatch(actionToggleStartOverButton({ disableStartOver: true }));
    // get 'demo' query param to toggle demo mode
    let params = new URLSearchParams(window.location.search);
    if (params.get('demo')) {
      if (Number(params.get('demo')) === 1) {
        this.props.dispatch(actionChangeDemoMode(true));
        localStorage.setItem('demo', true);
      } else if (Number(params.get('demo')) === 0) {
        this.props.dispatch(actionChangeDemoMode(false));
        localStorage.removeItem('demo');
        localStorage.removeItem('organizationId');
      }
    }
    if (Boolean(localStorage.getItem('demo'))) {
      this.props.dispatch(actionChangeDemoMode(true));
    }
    if (hash.substring(1) === "personal_loan" || hash.substring(1) === "small_business") {
      this.props.dispatch(actionSettingsChange({ "selectedLoanType": hash.substring(1) }));
    }
    // get 'brand' query param to set brand logo
    const brandName = params.get('brand');
    if (brandName) {
      const brandLogo = brandName == 'vista' ? '/vista-bank-logo.svg' : brandName == 'populus' ? '/populus.svg' : '/ABCBank.svg';
      this.props.dispatch(actionSettingsChange({brandLogo}));
      localStorage.setItem('brandLogo', brandLogo);
    }
    if (Boolean(localStorage.getItem('brandLogo'))) {
      this.props.dispatch(actionSettingsChange({'brandLogo': localStorage.getItem('brandLogo')}));
    }
  }
  componentWillUnmount() {
    this.props.dispatch(actionToggleStartOverButton({ disableStartOver: false }));
  }

  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      loanType: undefined
    };
  }

  render() {
    const {
      intl,
      settings: { submitDisabled, selectedLoanType },
      hash
    } = this.props;

    let loanType = undefined;
    // pre selection of loan
    if (selectedLoanType) {
      if (selectedLoanType === 'personal_loan') {
        loanType = LOAN_TYPES.personal_loan;
      } else if (selectedLoanType === 'small_business') {
        loanType = LOAN_TYPES.small_business;
      }
    }

    return (
      <div className="fortifid-get-started-form">
        <PageHeading
          title={<FormattedMessage id="forms.GetStartedForm.title" />}
          subtitle={!selectedLoanType ? <FormattedMessage id="forms.GetStartedForm.subtitle" /> : ''}
        />
        <Form
          initialValues={{
            loanType
          }}
          onSubmit={this.submit}
          render={({ handleSubmit, pristine, submitting, form, values }) => (
            <form onSubmit={handleSubmit}>
              {/* <FormFieldsWrapper>
                <FormField
                  className="demo-type-selection"
                  data={{
                    name: "demoType",
                    required: false,
                    type: FIELD_TYPES.select,
                    label: intl.formatMessage({
                      id: "forms.GetStartedForm.demoTypes.label",
                    }),
                    options: [
                          {
                         label: intl.formatMessage({
                          id: "forms.GetStartedForm.demoTypes.creditCard",
                        }),
                         value: LOAN_TYPES.credit_card,
                      },
                      {
                        label: intl.formatMessage({
                          id: "forms.GetStartedForm.demoTypes.personalLoan",
                        }),
                        value: LOAN_TYPES.personal_loan,
                      },
                      {
                        label: intl.formatMessage({
                          id: "forms.GetStartedForm.demoTypes.smallBusinessAndEquipment",
                        }),
                        value: LOAN_TYPES.small_business,
                      },
                    ],
                  }}
                />
                <OnChange name={"demoType"}>
                  {(value, previous) => {
                    if (value !== previous) {
                      form.change(
                        "loanType",
                        values.loanType = values.demoType
                      )
                    }
                    this.props.dispatch(actionApplicationInitialize(values, {}))
                  }}
                </OnChange>
              </FormFieldsWrapper> */}
              {
                selectedLoanType === 'personal_loan' ?
                    <FormField
                      className="loan-type-selection"
                      data={{
                        name: "loanType",
                        options: [
                          {
                            label: intl.formatMessage({
                              id: "forms.GetStartedForm.loanTypes.personalLoan",
                            }),
                            value: LOAN_TYPES.personal_loan,
                            icon: LoanPersonalIcon,
                          },
                          // {
                          //   label: intl.formatMessage({
                          //     id: "forms.GetStartedForm.loanTypes.smallBusinessAndEquipment",
                          //   }),
                          //   value: LOAN_TYPES.small_business,
                          //   icon: LoanSmallBusinessAndEquipmentIcon,
                          // },
                        ],
                        required: true,
                        type: FIELD_TYPES.radioimage,
                      }}
                    />
                  :
                  selectedLoanType === 'small_business' ?
                    <FormField
                        className="loan-type-selection"
                        data={{
                          name: "loanType",
                          options: [
                            // {
                            //   label: intl.formatMessage({
                            //     id: "forms.GetStartedForm.loanTypes.personalLoan",
                            //   }),
                            //   value: LOAN_TYPES.personal_loan,
                            //   icon: LoanPersonalIcon,
                            // },
                            {
                              label: intl.formatMessage({
                                id: "forms.GetStartedForm.loanTypes.smallBusinessAndEquipment",
                              }),
                              value: LOAN_TYPES.small_business,
                              icon: LoanSmallBusinessAndEquipmentIcon,
                            },
                          ],
                          required: true,
                          type: FIELD_TYPES.radioimage,
                        }}
                      /> : <FormField
                      className={`${!this.state.showError ? 'selected' : 'notSelected'}`}
                      data={{
                        name: "loanType",
                        options: [
                          {
                            label: intl.formatMessage({
                              id: "forms.GetStartedForm.loanTypes.personalLoan",
                            }),
                            value: LOAN_TYPES.personal_loan,
                            icon: LoanPersonalIcon,
                          },
                          {
                            label: intl.formatMessage({
                              id: "forms.GetStartedForm.loanTypes.smallBusinessAndEquipment",
                            }),
                            value: LOAN_TYPES.small_business,
                            icon: LoanSmallBusinessAndEquipmentIcon,
                          },
                        ],
                        required: true,
                        type: FIELD_TYPES.radioimage,
                      }}
                    />    
              }
              {this.state.showError ?
                <p className="error-text">Please select an option</p>
                : null
              }
              <div className="row no-gutters justify-content-center">
                <PrimaryButton
                  className="fortifid-get-started-form__button"
                  type={!this.state.loanType ? "button" : "submit"}
                  size="medium"
                  onClick={() => {this.state.loanType ? this.setState({ showError: false }) : this.setState({showError: true})}}
                >
                  <FormattedMessage id="forms.GetStartedForm.submit" />
                </PrimaryButton>
              </div>
              {/* <p style={{textAlign:"center"}} >Demo Mode</p>
              <div className="row no-gutters justify-content-center toggleButton mt-3">
                <input type="checkbox" id="switch"  onChange={handleChecked} />
                  <label className="demoSwitch" for="switch">Toggle</label>
              </div> */}
              <FormActionsWrapper className="row no-gutters justify-content-center">
                <TertiaryButton
                  onClick={() => {
                    navigate("/return")
                  }}
                  size="medium"
                >
                  <FormattedMessage id="continueButton" defaultMessage="Continue with an existing application" />
                </TertiaryButton>
              </FormActionsWrapper>
              <FormSpy
                onChange={(props) => {
                  this.setState({ loanType: props.values.loanType });
                  if (props.values.loanType) {
                    this.setState({ showError: false });
                  }
                }}
              />
            </form>
          )}
        />
        {
          this.props.individualData.isDemoMode &&
          <OrganizationDropdown/>
        }
      </div>
    )
  }
}

export default connect(state => ({
  applicationData: state.applicationData,
  individualData: state.individualData,
  businessData: state.businessData,
  settings: state.settings,
}))(injectIntl(GetStartedForm))
