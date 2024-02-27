import React, { Component } from "react"
import { connect } from "react-redux"
import { Form } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import FormField, { FIELD_TYPES } from "components/Shared/Form/FormField/FormField"
import Icon from "components/Shared/Icon/Icon"
import { Validators, composeValidators } from "components/Shared/Form/validators"
import PageHeading from "components/PageHeading/PageHeading"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import { FormFieldsWrapper, FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import LOAN_TYPES from "data/LoanTypes"
import moment from "moment"
import "./ExistingCustomerInfoForm"
import { actionApplicationDataUpdate, actionFillExistingCoApplicant, actionFillExistingDemoData, actionResetExistingCustomerInfo } from "../../state/actions"
import DemoDataExistingCustomer from "../../../data/DemoDataExistingCustomer.json"
import DemoDropdown from "../../../data/DemoDropdown.json"
import { processCoApplicantValues } from "../../Shared/helpers"

class ExistingCustomerInfoForm extends Component {

  submit = async values => {
    this.props.onSubmit(processCoApplicantValues(values))
  }

  componentDidMount() {
    if (!this.props.individualData.isDemoMode) {
      this.props.dispatch(actionResetExistingCustomerInfo());
      this.props.dispatch(actionApplicationDataUpdate({loanAmount: '', loanPurpose: ''}));
    };
    
    const firstField = document.getElementById("addressZip");
    if (firstField) {
      firstField.focus();
    }
  }

  render() {
    const {
      intl,
      applicationData: {
        federalIdNumber,
        birthDate,
        addressZip,
        coApplicant,
        coApplication,
        coApplicationFirstName,
        coApplicationMiddleName,
        coApplicationLastName,
        coApplicationEmailAddress
      },
      settings: { submitDisabled },
    } = this.props;

    var ExistingData = DemoDataExistingCustomer.ExistingCustomerData;

    var DemoData = DemoDropdown.existingdata;
    

    const handleDropDown = (event, values) => {
      let result = DemoDropdown["existingdata"].filter((el) => {
        if (el.id == event.target.value) {
          return el;
        }
      })

      if (result) {
        this.props.dispatch(actionFillExistingCoApplicant({
          first_name: values.coApplicationFirstName,
          middle_name: values.coApplicationMiddleName,
          last_name: values.coApplicationLastName,
          email: values.coApplicationEmailAddress,
          coApplicationNew: values.coApplication,
          coApplicantNew: values.coApplicant
        }));
        this.props.dispatch(actionFillExistingDemoData(result[0]));
      }
    }

    const handleDropDownCoApplicant = (event, values) => {
      let result = DemoDropdown["existingdata"].filter((el) => {
        if (el.id == event.target.value) {
          return el;
        }
      })
     
      if (result) {
        // this.props.dispatch(actionFillExistingDemoData({
        //   dob: values.birthDate,
        //   ssn: values.federalIdNumber,
        //   zip: values.addressZip
        // }));
        this.props.dispatch(actionFillExistingCoApplicant({ ...result[0], coApplicant: values.coApplicant, coApplication: values.coApplication }));
      }
    }
    this.props.applicationData.coApplicant = false;
    return (
      <div className="fortifid-existing-customer-info-form">
        {this.props.applicationData.coApplicant ? (
          <PageHeading
            title={<FormattedMessage id="forms.ExistingCustomerInfoForm.coApplicant.title" />}
            subtitle={<FormattedMessage id="forms.ExistingCustomerInfoForm.coApplicant.subtitle" />}
          />
        ) : (
          <PageHeading title={<FormattedMessage id="forms.ExistingCustomerInfoForm.title" />}
            subtitle={<FormattedMessage id="forms.ExistingCustomerInfoForm.subtitle" />}
          />
        )}
        <Form
          initialValues={{
            federalIdNumber,
            birthDate,
            addressZip,
            coApplicant,
            coApplication,
            coApplicationFirstName,
            coApplicationMiddleName,
            coApplicationLastName,
            coApplicationEmailAddress,
          }}
          onSubmit={this.submit}
          render={({ handleSubmit, submitting, values }) => (
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
                  <div className="fortifid-existing-customer-info-form__subtitle-container">
                    <span>
                      <FormattedMessage id="forms.ExistingCustomerInfoForm.subtitle" />
                    </span>
                  </div>
                )}
                {
                  this.props.individualData.isDemoMode === true && <>
                    <label for="demoData"></label>
                    <select name="demodata" id="demodata" onChange={(event) => handleDropDown(event, values)}
                      style={{
                        width: "100%",
                        margin: "20px 0px",
                        padding: "15px 5px",
                        borderRadius: 5,
                        border: "solid 1px #c2d2d9"
                      }}>
                      <option value="">Select Demo Data</option>

                      {ExistingData.filter(data => {
                        return data.type === this.props.applicationData.loanType;
                      }).map((curr, index) => {
                        return <option key={index} value={curr.id}>{curr.demo_applicant}</option>
                      })}
                    </select>
                  </>
                }

                <FormField
                  name="addressZip"
                  data={{
                    format: "12345-6789",
                    label: intl.formatMessage({
                      id: "forms.ExistingCustomerInfoForm.fields.addressZip.label",
                    }),
                    name: "addressZip",
                    required: true,
                    type: FIELD_TYPES.phone,
                    maxLength: 10,
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(
                        intl.formatMessage({
                          id: "formErrors.requiredField",
                        })
                      ),
                      Validators.addressZip(
                        intl.formatMessage({
                          id: "forms.ExistingCustomerInfoForm.fields.addressZip.error",
                        })
                      ),
                    ]
                  )}
                />
                <FormField
                  name="federalIdNumber"
                  data={{
                    required: true,
                    name: "federalIdNumber",
                    type: FIELD_TYPES.masked,
                    label: intl.formatMessage({
                      id: "forms.ExistingCustomerInfoForm.fields.federalIdNumber.label",
                    }),
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                      Validators.ssn(
                        intl.formatMessage({
                          id: "forms.ExistingCustomerInfoForm.fields.federalIdNumber.error",
                        })
                      ),
                    ]
                  )}
                />
                <FormField
                  name="birthDate"
                  pattern="MM/DD/YYYY"
                  maskRegex={/\d/g}
                  data={{
                    required: true,
                    name: "birthDate",
                    type: FIELD_TYPES.masked,
                    label: intl.formatMessage({
                      id: "forms.ExistingCustomerInfoForm.fields.birthDate.label",
                    }),
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                      Validators.date(
                        intl.formatMessage({
                          id: "forms.ExistingCustomerInfoForm.fields.birthDate.error",
                        }),
                        "MM/DD/YYYY",
                        moment().subtract(120, "years"),
                        undefined,
                        "[)"
                      ),
                      Validators.dob(
                        intl.formatMessage({
                          id: "forms.SSNForm.fields.birthDate.error",
                        }),
                        "MM/DD/YYYY",
                      ),
                    ]
                  )}
                />
              </FormFieldsWrapper>
              {this.props.applicationData.flowType !== LOAN_TYPES.credit_card && !this.props.applicationData.coApplicant && (
                <FormFieldsWrapper>
                  <div className="fortifid-form__co-applicant">
                    <FormField
                      name="coApplication"
                      data={{
                        name: "coApplication",
                        type: FIELD_TYPES.radio,
                        label: intl.formatMessage({
                          id: "forms.ExistingCustomerInfoForm.fields.coApplication.label",
                        }),
                        hint: intl.formatMessage({
                          id: "forms.ExistingCustomerInfoForm.fields.coApplication.hint",
                        }),
                        style: "responsive",
                        options: [
                          {
                            label: intl.formatMessage({
                              id: "forms.ExistingCustomerInfoForm.fields.coApplication.optionTrue",
                            }),
                            value: true,
                          },
                          {
                            label: intl.formatMessage({
                              id: "forms.ExistingCustomerInfoForm.fields.coApplication.optionFalse",
                            }),
                            value: false,
                          },
                        ],
                      }}
                      validate={composeValidators(...[Validators.boolean(intl.formatMessage({ id: "formErrors.requiredField" }))])}
                    />
                  </div>

                  {this.props.individualData.isDemoMode === true && <>
                    <label for="demoData"></label>
                    <select disabled={!values.coApplication} name="demodata" id="demodata" onChange={(event) => handleDropDownCoApplicant(event,values)}
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
                  </>}
                  <FormField
                    name="coApplicationFirstName"
                    disabled={!values.coApplication}
                    data={{
                      required: values.coApplication,
                      name: "coApplicationFirstName",
                      type: FIELD_TYPES.text,
                      maxLength: 50,
                      label: intl.formatMessage({
                        id: "forms.ExistingCustomerInfoForm.fields.coApplicationFirstName.label",
                      }),
                    }}
                    validate={(value, allValues) =>
                      allValues.coApplication
                        ? composeValidators(
                          ...[
                            Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                            Validators.name(
                              intl.formatMessage({
                                id: "forms.ExistingCustomerInfoForm.fields.coApplicationFirstName.error",
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
                        id: "forms.ExistingCustomerInfoForm.fields.coApplicationMiddleName.label",
                      }),
                    }}
                    validate={(value, allValues) =>
                      allValues.coApplication
                        ? composeValidators(
                          ...[
                            Validators.name(
                              intl.formatMessage({
                                id: "forms.ExistingCustomerInfoForm.fields.coApplicationMiddleName.error",
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
                        id: "forms.ExistingCustomerInfoForm.fields.coApplicationLastName.label",
                      }),
                    }}
                    validate={(value, allValues) =>
                      allValues.coApplication
                        ? composeValidators(
                          ...[
                            Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                            Validators.name(
                              intl.formatMessage({
                                id: "forms.ExistingCustomerInfoForm.fields.coApplicationLastName.error",
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
                        id: "forms.ExistingCustomerInfoForm.fields.coApplicationEmailAddress.label",
                      }),
                      hint: intl.formatMessage({
                        id: "forms.ExistingCustomerInfoForm.fields.coApplicationEmailAddress.hint",
                      }),
                    }}
                    validate={(value, allValues) =>
                      allValues.coApplication
                        ? composeValidators(
                          ...[
                            Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                            Validators.email(
                              intl.formatMessage({
                                id: "forms.ExistingCustomerInfoForm.fields.coApplicationEmailAddress.error",
                              })
                            ),
                          ]
                        )(value, allValues)
                        : undefined
                    }
                    suggestion={value =>
                      intl.formatMessage(
                        {
                          id: "forms.ExistingCustomerInfoForm.fields.coApplicationEmailAddress.suggestion",
                        },
                        { email: value.full }
                      )
                    }
                  />
                  <FormField
                    name="terms-checkbox"
                    data={{
                      name: "terms-checkbox",
                      type: "checkbox",
                      label: intl.formatMessage({
                        id: "forms.ExistingCustomerInfoForm.fields.terms.label",
                      }),
                      required: true,
                    }}
                  />
                </FormFieldsWrapper>
              )}
              <FormActionsWrapper>
                <TertiaryButton size="medium" onClick={this.props.onPrev}>
                  <Icon name="Previous" className="fortifid-icon__previous" />
                  <FormattedMessage id="prevButton" defaultMessage="Previous" />
                </TertiaryButton>
                {this.props.individualData.employmentStatus !== undefined && (
                  <TertiaryButton size="medium" onClick={this.props.onReview}>
                    <FormattedMessage id="backButton" defaultMessage="Back to review" />
                  </TertiaryButton>
                )}
                <PrimaryButton className="cta-button" disabled={submitting || submitDisabled || !values["terms-checkbox"]} type="submit" size="medium"  >
                  {this.props.applicationData.coApplicant ? (
                    <FormattedMessage id="confirmButton" defaultMessage="Confirm & Continue" />
                  ) : (
                    <FormattedMessage id="nextButton" defaultMessage="Submit" />
                  )}
                  <Icon name="Next" className="fortifid-icon__next" />
                </PrimaryButton>
              </FormActionsWrapper>
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
  settings: state.settings,
}))(injectIntl(ExistingCustomerInfoForm))
