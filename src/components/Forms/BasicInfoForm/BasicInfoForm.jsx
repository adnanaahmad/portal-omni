import React, { Component } from "react"
import { connect } from "react-redux"
import { Form, FormSpy } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import FormField, { FIELD_TYPES } from "components/Shared/Form/FormField/FormField"
import Icon from "components/Shared/Icon/Icon"
import { Validators, composeValidators } from "components/Shared/Form/validators"
import PageHeading from "components/PageHeading/PageHeading"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import { FormFieldsWrapper, FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import LOAN_TYPES from "data/LoanTypes"
import DemoDropdown from "../../../data/DemoDropdown.json"
import "./BasicInfoForm.scss"
import { actionExistingDataFormSubmit, actionFillCoApplicantData, actionFillDemoData } from "../../state/actions"
import beautifyPhoneNumber from "../../../constants/beautifyPhoneNumber";
import FormNames from "../../../constants/forms";
import moment from "moment";
import { call } from "redux-saga/effects";
import API from "../../../components/api";
import { scrollToElement, processCoApplicantValues } from "../../Shared/helpers"
import { SSNFormFields } from "../SSNForm/SSNForm"
import { DLNFormFields } from "../DLNForm/DLNForm"
import ReviewButton from "../../Shared/Button/ReviewButton"
const ISO_1366_2 = require("../../../data/iso-3166-2.json");
//TODO: Make this global

class BasicInfoForm extends Component {

  constructor(props) {
      super(props);
      this.state = {formError: undefined};
      this.firstNameRef = React.createRef(null);
      this.middleNameRef = React.createRef(null);
      this.lastNameRef = React.createRef(null);
      this.mobilePhoneRef = React.createRef(null);
      this.emailAddressRef = React.createRef(null);
  }

  submit = async values => {
    if(!values.middleName) values.middleName = '';
    this.props.onSubmit(processCoApplicantValues(values));
  }
  editExistingCustomer = async values => {
    if(!values.middleName) values.middleName = '';
    this.props.dispatch(actionExistingDataFormSubmit(values, { formName: FormNames.FORM_BASIC_INFO }));
  }

  componentDidMount() {
    //console.log(this.props.settings.editForm);
    const firstField = document.getElementById("firstName");
    if (firstField) {
      firstField.focus();
    }
  }

  componentDidUpdate() {
    if (this.props.settings.closeForm) {
      this.props.cancel();
    }
  }
  // scroll user to error field
  handleClickRef = () => {
    if (!this.state.formError) return;
    
    if (this.state.formError.firstName) {
      scrollToElement(this.firstNameRef);
    } else if (this.state.formError.middleName) {
      scrollToElement(this.middleNameRef);
    } else if (this.state.formError.lastName) {
      scrollToElement(this.lastNameRef);
    } else if (this.state.formError.mobilePhone) {
      scrollToElement(this.mobilePhoneRef);
    } else if (this.state.formError.emailAddress) {
      scrollToElement(this.emailAddressRef);
    }
  };

  render() {   
    let {
      intl,
      individualData: {
        firstName,
        middleName,
        lastName,
        emailAddress,
        mobilePhone,
        coApplicant,
        coApplication,
        coApplicationFirstName,
        coApplicationMiddleName,
        coApplicationLastName,
        coApplicationEmailAddress,
        federalIdNumber,
        birthDate,
        isUSCitizen,
        driversLicenseNumber,
        driversLicenseState,
        driversLicenseExpireDate,
      },
      settings: { submitDisabled },
      existingCustomerData,
    } = this.props;

    // update fields from existingCustomerData state when existing customer is editing basic info form in summary page
    let existingCustomerPersonalInfo = {};
    if(this.props.editExistingCustomer) existingCustomerPersonalInfo = {...existingCustomerData.personalData};

    let additionalFieldsForIndividualCustomer = {}
    // update addtional fields from individual data when new customer is editing basic info form in summary page
    if(this.props.settings.editForm) {
      additionalFieldsForIndividualCustomer = {
        federalIdNumber,
        birthDate,
        isUSCitizen,
        driversLicenseNumber,
        driversLicenseState,
        driversLicenseExpireDate,
      }
    }

    var DemoData = DemoDropdown.existingdata;

    const handleDropDown = (event, values) => {
      let result = DemoDropdown["existingdata"].filter((el) => {
        if (el.id == event.target.value) {
          return el;
        }
      })
      if (result) {
        this.props.dispatch(actionFillDemoData({
          first_name: values.firstName, 
          middle_name: values.middleName, 
          last_name: values.lastName, 
          email: values.emailAddress,
          coApplicant: values.coApplicant,
          coApplication: values.coApplication,
          phone: values.mobilePhone,
          ssn: this.props.individualData.federalIdNumber,
          dob:this.props.individualData.birthDate,
          is_us_citizen:this.props.individualData.isUSCitizen,
          state_issue:this.props.individualData.driversLicenseState,
          exp_date:this.props.individualData.driversLicenseExpireDate,
          dl_number:this.props.individualData.driversLicenseNumber,
          address:this.props.individualData.addressStreet,
          city:this.props.individualData.addressCity,
          state:this.props.individualData.addressState,
          zip:this.props.individualData.addressZip,
          live_period:this.props.individualData.addressLivePeriod,
          years_live_period: this.props.individualData.addressYears,
          months_live_period: this.props.individualData.addressMonths,
          property_use_type:this.props.individualData.homeRentOrOwn,
          monthly_rent:this.props.individualData.homeMonthlyRentMortgage,
          mortgage:this.props.individualData.homeMonthlyRentMortgage,
          note:this.props.individualData.homeAdditionalDetails,
          is_fully_own:this.props.individualData.homeIsFullyOwnedNoMortgage,
          bank_name:this.props.individualData.financialBankName,
          account_type:this.props.individualData.financialAccountType,
          cash_advance:this.props.individualData.financialCreditCardCashAdvStatus,
          income_type:this.props.individualData.incomeSource,
          annual_income:this.props.individualData.incomeIndividualAnnualGross,
          household_income:this.props.individualData.incomeHouseholdAnnualGross,
          net_income:this.props.individualData.netIncome,
          isDirectDeposite:this.props.individualData.incomeHasDirectDeposit,
          name:this.props.individualData.employmentEmployerName,
          emp_state:this.props.individualData.employmentAddressState,
          job_title:this.props.individualData.employmentJobTitle,
          months_length: this.props.individualData.employmentMonths,
          years_length: this.props.individualData.employmentYears,
          address:this.props.individualData.employmentAddressStreet,
          city:this.props.individualData.employmentAddressCity,
          emp_status:this.props.individualData.employmentStatus,
          zip:this.props.individualData.employmentAddressZip,

          business_type:this.props.businessData.businessType,
          owner_type:this.props.businessData.typeOfOwnership,
          company:this.props.businessData.companyName,
          federal_number_type:this.props.businessData.federalIdNumberType,
          federal_number:this.props.businessData.federalIdNumber,
          website:this.props.businessData.webSite,
          address:this.props.businessData.addressStreet,
          city:this.props.businessData.addressCity,
          state:this.props.businessData.addressState,
          registration_state:this.props.businessData.registrationState,
          zip:this.props.businessData.addressZip,
          business_phone:this.props.businessData.phoneNumber,
          date_established:this.props.businessData.dateEstablished,

          loanAmount: this.props.applicationData.loanAmount,
          loanPurpose: this.props.applicationData.loanPurpose,
        }));
        this.props.dispatch(actionFillCoApplicantData(result[0]));
      }
    }

    const handleDropDownCoApplicantReturn = (event, values) => {
      let result = DemoDropdown["existingdata"].filter((el) => {
        if (el.id == event.target.value) {
          return el;
        }
      })
      if (result) {
        this.props.dispatch(actionFillCoApplicantData({
          first_name: values.coApplicationFirstName,
          middle_name: values.coApplicationMiddleName,
          last_name: values.coApplicationLastName,
          email: values.coApplicationEmailAddress,
          coApplicationNew: values.coApplication,
          coApplicantNew: values.coApplicant,
        }));
        this.props.dispatch(actionFillDemoData(result[0]))
      }
    }

    mobilePhone = beautifyPhoneNumber(mobilePhone);
    return (
      <div className="fortifid-basic-info-form">
        {this.props.applicationData.coApplicant ? (
          <PageHeading
            title={<FormattedMessage id="forms.BasicInfoForm.coApplicant.title" />}
            subtitle={<FormattedMessage id="forms.BasicInfoForm.coApplicant.subtitle" />}
          />
        ) : (
          <PageHeading title={<FormattedMessage id="forms.BasicInfoForm.title" />} />
        )}
        <Form
          initialValues={{
            firstName,
            middleName,
            lastName,
            emailAddress,
            mobilePhone,
            coApplicant,
            coApplication,
            coApplicationFirstName,
            coApplicationMiddleName,
            coApplicationLastName,
            coApplicationEmailAddress,
            ...existingCustomerPersonalInfo,
            ...additionalFieldsForIndividualCustomer,
            'terms-checkbox': localStorage.getItem("nextBtnHitBasicInfo") && true
          }}
          onSubmit={!this.props.editExistingCustomer ? this.submit : this.editExistingCustomer}
          render={({ handleSubmit, submitting, values, form }) => (
            <form onSubmit={handleSubmit}>
              {this.props.applicationData.coApplicant && (
                <FormFieldsWrapper>
                  <FormField
                    name="loanAmount"
                    disabled={true}
                    data={{
                      allowDecimals: false,
                      allowNegativeValue: false,
                      disableAbbreviations: true,
                      intlConfig: { locale: intl.locale, currency: "USD" },
                      label: `${Intl.NumberFormat(intl.locale, { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(this.props.applicationData.loanAmount)}`,
                      maxLength: 12,
                      name: "loanAmount",
                      required: true,
                      type: FIELD_TYPES.currency,
                    }}
                  />
                  <FormField
                    name="loanPurpose"
                    disabled={true}
                    isSearchable={true}
                    data={{
                      label: `${this.props.applicationData.loanPurpose}`,
                      hint: intl.formatMessage({
                        id: "forms.LoanDetailsForm.fields.loanPurpose.hint",
                      }),
                      name: "loanPurpose",
                      required: true,
                      type: FIELD_TYPES.text,
                    }}
                  />
                </FormFieldsWrapper>
              )}
              <FormFieldsWrapper>
                {this.props.applicationData.coApplicant && (
                  <div className="fortifid-basic-info-form__subtitle-container">
                    <span>
                      <FormattedMessage id="forms.BasicInfoForm.subtitle" />
                    </span>
                  </div>
                )}

                {/* <FormField
                  name="demoData"
                  isSearchable={true}
                  data={{
                    label: intl.formatMessage({
                      id: "forms.BasicInfoForm.fields.demoData.label",
                    }),
                    name: "demoData",
                    options: DemoData.map(option => ({
                      firstName: option.first_name,
                      label: intl.formatMessage({
                        id: "forms.BasicInfoForm.fields.demoData.label.firstName",
                        defaultMessage: option.first_name,
                      }),
                      value: option.id,
                    })),
                    type: FIELD_TYPES.select,
                  }}
                /> */}
                {
                  (this.props.individualData.isDemoMode && this.props.individualData.coApplicantReturnFlow) && <>
                    <label for="demoData"></label>
                    <select name="demodata" id="demodata" onChange={(e) => handleDropDownCoApplicantReturn(e, values)}
                      style={{
                        width: "100%",
                        margin: "20px 0px",
                        padding: "15px 5px",
                        borderRadius: 5,
                        border: "solid 1px #c2d2d9"
                      }}>
                      <option value="">Select co-applicant </option>
                      {DemoData.filter(data => {
                        return data.type === this.props.applicationData.loanType;
                      }).map((curr, index) => {
                        return <option key={index} value={curr.id}>{curr.demo_applicant}</option>
                      })}
                    </select></>
                }
                <div ref={this.firstNameRef}>
                  <FormField
                    name="firstName"
                    data={{
                      required: true,
                      name: "firstName",
                      type: FIELD_TYPES.text,
                      maxLength: 50,
                      label: intl.formatMessage({
                        id: "forms.BasicInfoForm.fields.firstName.label",
                      }),
                    }}
                    validate={composeValidators(
                      ...[
                        Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                        Validators.name(
                          intl.formatMessage({
                            id: "forms.BasicInfoForm.fields.firstName.error",
                          })
                        ),
                      ]
                    )}
                  />
                </div>
                <div ref={this.middleNameRef}>
                  <FormField
                    name="middleName"
                    data={{
                      required: false,
                      name: "middleName",
                      type: FIELD_TYPES.text,
                      maxLength: 50,
                      label: intl.formatMessage({
                        id: "forms.BasicInfoForm.fields.middleName.label",
                      }),
                    }}
                    validate={composeValidators(
                      ...[
                        Validators.name(
                          intl.formatMessage({
                            id: "forms.BasicInfoForm.fields.middleName.error",
                          })
                        ),
                      ]
                    )}
                  />
                </div>
                <div ref={this.lastNameRef}>
                  <FormField
                    name="lastName"
                    data={{
                      required: true,
                      name: "lastName",
                      maxLength: 50,
                      type: FIELD_TYPES.text,
                      label: intl.formatMessage({
                        id: "forms.BasicInfoForm.fields.lastName.label",
                      }),
                    }}
                    validate={composeValidators(
                      ...[
                        Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                        Validators.name(
                          intl.formatMessage({
                            id: "forms.BasicInfoForm.fields.lastName.error",
                          })
                        ),
                      ]
                    )}
                  />
                </div>
                <div ref={this.mobilePhoneRef}>
                  <FormField
                    name="mobilePhone"
                    required
                    data={{
                      required: true,
                      name: "mobilePhone",
                      type: FIELD_TYPES.phone,
                      country_code: "US",
                      format: "(123) 456-7890",
                      label: intl.formatMessage({
                        id: "forms.BasicInfoForm.fields.mobilePhone.label",
                      }),
                      hint: intl.formatMessage({
                        id: "forms.BasicInfoForm.fields.mobilePhone.hint",
                      }),
                    }}
                    validate={composeValidators(
                      ...[
                        Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                        Validators.phone(
                          intl.formatMessage({
                            id: "forms.BasicInfoForm.fields.mobilePhone.error",
                          }),
                          "US"
                        ),
                      ]
                    )}
                  />
                </div>
                <div ref={this.emailAddressRef}>
                  <FormField
                    name="emailAddress"
                    required
                    data={{
                      required: true,
                      name: "emailAddress",
                      type: FIELD_TYPES.email,
                      maxLength: 320,
                      label: intl.formatMessage({
                        id: "forms.BasicInfoForm.fields.emailAddress.label",
                      }),
                    }}
                    validate={composeValidators(
                      ...[
                        Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                        Validators.email(
                          intl.formatMessage({
                            id: "forms.BasicInfoForm.fields.emailAddress.error",
                          })
                        ),
                      ]
                    )}
                    suggestion={value =>
                      intl.formatMessage(
                        {
                          id: "forms.BasicInfoForm.fields.emailAddress.suggestion",
                        },
                        { email: value.full }
                      )
                    }
                  />
                </div>
              </FormFieldsWrapper>

              {
                (this.props.editExistingCustomer || this.props.settings.editForm) &&
                <React.Fragment>
                  <SSNFormFields data={{intl}}/>
                  <DLNFormFields data={{intl}}/>
                </React.Fragment>
              }

              {!this.props.individualData.coApplicantReturnFlow && !this.props.editExistingCustomer && !this.props.settings.editForm && <>
                {this.props.applicationData.flowType !== LOAN_TYPES.credit_card && !this.props.applicationData.coApplicant && (
                  <FormFieldsWrapper>
                    <div className="fortifid-form__co-applicant">
                      <FormField
                        name="coApplication"
                        data={{
                          name: "coApplication",
                          type: FIELD_TYPES.radio,
                          label: intl.formatMessage({
                            id: "forms.BasicInfoForm.fields.coApplication.label",
                          }),
                          hint: intl.formatMessage({
                            id: "forms.BasicInfoForm.fields.coApplication.hint",
                          }),
                          style: "responsive",
                          options: [
                            {
                              label: intl.formatMessage({
                                id: "forms.BasicInfoForm.fields.coApplication.optionTrue",
                              }),
                              value: true,
                            },
                            {
                              label: intl.formatMessage({
                                id: "forms.BasicInfoForm.fields.coApplication.optionFalse",
                              }),
                              value: false,
                            },
                          ],
                        }}
                        validate={composeValidators(...[Validators.boolean(intl.formatMessage({ id: "formErrors.requiredField" }))])}
                      />
                    </div>

                    { this.props.individualData.isDemoMode &&
                      <>
                        <label for="demoData"></label>
                        <select disabled={!values.coApplication} name="demodata" id="demodata" onChange={(e) => handleDropDown(e, values)}
                          style={{
                            width: "100%",
                            margin: "20px 0px",
                            padding: "15px 5px",
                            borderRadius: 5,
                            border: "solid 1px #c2d2d9"
                          }}>
                          <option value="">Select co-applicant </option>
                          {DemoData.filter(data => {
                            return data.type === this.props.applicationData.loanType;
                          }).map((curr, index) => {
                            return <option key={index} value={curr.id}>{curr.demo_applicant}</option>
                          })}
                        </select>
                      </>
                    }
                    <FormField
                      name="coApplicationFirstName"
                      disabled={!values.coApplication}
                      data={{
                        required: values.coApplication,
                        name: "coApplicationFirstName",
                        type: FIELD_TYPES.text,
                        maxLength: 50,
                        label: intl.formatMessage({
                          id: "forms.BasicInfoForm.fields.coApplicationFirstName.label",
                        }),
                      }}
                      validate={(value, allValues) =>
                        allValues.coApplication
                          ? composeValidators(
                            ...[
                              Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                              Validators.name(
                                intl.formatMessage({
                                  id: "forms.BasicInfoForm.fields.coApplicationFirstName.error",
                                })
                              ),
                            ]
                          )(value, allValues)
                          : undefined
                      }
                    />
                    <FormField
                      name="coApplicationMiddleName"
                      disabled={!values.coApplication}
                      data={{
                        required: false,
                        name: "coApplicationMiddleName",
                        type: FIELD_TYPES.text,
                        maxLength: 50,
                        label: intl.formatMessage({
                          id: "forms.BasicInfoForm.fields.coApplicationMiddleName.label",
                        }),
                      }}
                      validate={(value, allValues) =>
                        allValues.coApplication
                          ? composeValidators(
                            ...[
                              Validators.name(
                                intl.formatMessage({
                                  id: "forms.BasicInfoForm.fields.coApplicationMiddleName.error",
                                })
                              ),
                            ]
                          )(value, allValues)
                          : undefined
                      }
                    />
                    <FormField
                      name="coApplicationLastName"
                      disabled={!values.coApplication}
                      data={{
                        required: values.coApplication,
                        name: "coApplicationLastName",
                        maxLength: 50,
                        type: FIELD_TYPES.text,
                        label: intl.formatMessage({
                          id: "forms.BasicInfoForm.fields.coApplicationLastName.label",
                        }),
                      }}
                      validate={(value, allValues) =>
                        allValues.coApplication
                          ? composeValidators(
                            ...[
                              Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                              Validators.name(
                                intl.formatMessage({
                                  id: "forms.BasicInfoForm.fields.coApplicationLastName.error",
                                })
                              ),
                            ]
                          )(value, allValues)
                          : undefined
                      }
                    />
                    <FormField
                      name="coApplicationEmailAddress"
                      disabled={!values.coApplication}
                      data={{
                        required: values.coApplication,
                        name: "coApplicationEmailAddress",
                        type: `${values.coApplication ? FIELD_TYPES.email : FIELD_TYPES.text}`,
                        maxLength: 320,
                        label: intl.formatMessage({
                          id: "forms.BasicInfoForm.fields.coApplicationEmailAddress.label",
                        }),
                        hint: intl.formatMessage({
                          id: "forms.BasicInfoForm.fields.coApplicationEmailAddress.hint",
                        }),
                      }}
                      validate={(value, allValues) =>
                        allValues.coApplication
                          ? composeValidators(
                            ...[
                              Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                              Validators.email(
                                intl.formatMessage({
                                  id: "forms.BasicInfoForm.fields.coApplicationEmailAddress.error",
                                })
                              ),
                            ]
                          )(value, allValues)
                          : undefined
                      }
                      suggestion={value =>
                        intl.formatMessage(
                          {
                            id: "forms.BasicInfoForm.fields.coApplicationEmailAddress.suggestion",
                          },
                          { email: value.full }
                        )
                      }
                    />
                  </FormFieldsWrapper>
                )}</>}

              <FormFieldsWrapper>
                <FormField
                  name="terms-checkbox"
                  data={{
                    name: "terms-checkbox",
                    type: "checkbox",
                    label: intl.formatMessage({
                      id: "forms.BasicInfoForm.fields.terms.label",
                    }),
                  }}
                />
              </FormFieldsWrapper>
              {
                (!this.props.editExistingCustomer && !this.props.settings.editForm) &&
                <FormActionsWrapper>
                  <TertiaryButton size="medium" onClick={this.props.onPrev} disabled={this.props.individualData.coApplicantReturnFlow}>
                    <Icon name="Previous" className="fortifid-icon__previous" />
                    <FormattedMessage id="prevButton" defaultMessage="Previous" />
                  </TertiaryButton>
                  <ReviewButton backToReview={this.props.onReview} />
                  <PrimaryButton onClick={this.handleClickRef} className="cta-button" disabled={submitting || submitDisabled || !values["terms-checkbox"]} type="submit" size="medium"  >
                    {this.props.applicationData.coApplicant && (
                      <FormattedMessage id="confirmButton" defaultMessage="Confirm & Continue" />
                    )}
                    {!this.props.applicationData.coApplicant && (
                      <FormattedMessage id="nextButton" defaultMessage="Submit" />
                    )}
                    <Icon name="Next" className="fortifid-icon__next" />
                  </PrimaryButton>
                </FormActionsWrapper>
              }
              {
                (this.props.editExistingCustomer || this.props.settings.editForm) &&
                <FormActionsWrapper>
                  <TertiaryButton size="medium" onClick={this.props.editExistingCustomer ? this.props.cancel : this.props.onReview}>
                    <FormattedMessage id="cancelButton" defaultMessage="Cancel" />
                  </TertiaryButton>
                  <PrimaryButton className="cta-button" disabled={submitting || submitDisabled || !values["terms-checkbox"]} type="submit" size="medium"  >
                      <FormattedMessage id="saveButton" defaultMessage="Save" />
                  </PrimaryButton>
                </FormActionsWrapper>
              }

              <FormSpy
                onChange={props => {
                  this.setState({formError: props.errors})
                }}
              />
            </form>
          )}
        />
      </div>
    )
  }
}

export default connect(state => ({
  applicationData: state.applicationData,
  individualData: state.individualData,
  businessData: state.businessData,
  existingCustomerData: state.existingCustomerData,
  settings: state.settings,
}))(injectIntl(BasicInfoForm))
