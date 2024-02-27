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
import { FORMER_ADDRESS_THRESHOLD } from "constants/common"
import ISO_1366_2 from "data/iso-3166-2.json"
import { Condition, WhenFieldChanges } from "components/Shared/Form/FormHelpers"
import OWNERSHIP_TYPES from "data/HomeOwnershipTypes.json"

import "./AddressInfoForm.scss";
import { calculateMonthsForLength, titleCase } from "../../Shared/helpers"
import { actionExistingDataFormSubmit } from "../../state/actions"
import FormNames from "constants/forms";
import { FormerAddressInfoFields, processFormerAddressForm } from "../FormerAddressInfoForm/FormerAddressInfoForm"
import { OnChange } from 'react-final-form-listeners'
import { IncomeHousingFormFields } from "../IncomeHousingForm/IncomeHousingForm"
import ReviewButton from "../../Shared/Button/ReviewButton"

export function processIncomeHousingDetails(values) {
  if (values.homeRentOrOwn === OWNERSHIP_TYPES.own) {
    values.homeAdditionalDetails = null;
    if (values.homeIsFullyOwnedNoMortgage) {
      values.homeIsFullyOwnedNoMortgage = 1;
      values.homeMonthlyRentMortgage = null;
    } else {
      values.homeIsFullyOwnedNoMortgage = 0;
    }
  } else if (values.homeRentOrOwn === OWNERSHIP_TYPES.rent) {
    values.homeAdditionalDetails = null
    values.homeIsFullyOwnedNoMortgage = null
  } else if (values.homeRentOrOwn === OWNERSHIP_TYPES.other) {
    values.homeMonthlyRentMortgage = null
    values.homeIsFullyOwnedNoMortgage = null
  }
  return values;
}

function processAddressForm(values) {
  if (calculateMonthsForLength(values.addressMonths, values.addressYears) >= FORMER_ADDRESS_THRESHOLD) {
    values.formerAddressCity = "";
    values.formerAddressStreet = "";
    values.formerAddressState = "";
    values.formerAddressAptSuiteNumber = "";
    values.formerAddressZip = "";
    values.formerAddressMonths = "";
    values.formerAddressYears = "";
    values.formerAddressLivePeriod = "";
  }
  if(!values.addressAptSuiteNumber) values.addressAptSuiteNumber = "";
  if(!values.addressMonths) values.addressMonths = 0;
  if(!values.addressYears) values.addressYears = 0;
  values.addressLivePeriod = calculateMonthsForLength(values.addressMonths, values.addressYears);
  return values;
}

class AddressInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {showFormerAddressForm: false};
  }
  submit = async values => {

    if(this.props.settings.editForm) {
      values = processIncomeHousingDetails(values);
      values = processFormerAddressForm(values);
    }

    values = processAddressForm(values);
    this.props.onSubmit(values)
  }

  editExistingCustomer = async values => {
    //console.log(values);
    values = processIncomeHousingDetails(values);
    values = processFormerAddressForm(values);
    values = processAddressForm(values);
    this.props.dispatch(actionExistingDataFormSubmit(values, { formName: FormNames.FORM_ADDRESS }));
  }

  componentDidMount() {
    const firstField = document.getElementById("addressStreet");
    if (firstField) {
      firstField.focus();
    }
    if (this.props.settings.editForm) {
      this.props.individualData.addressLivePeriod < FORMER_ADDRESS_THRESHOLD ? this.setState({showFormerAddressForm: true}) : this.setState({showFormerAddressForm: false});
    }
    if (this.props.editExistingCustomer) {
      this.props.existingCustomerData.addressData.addressLivePeriod < FORMER_ADDRESS_THRESHOLD ? this.setState({showFormerAddressForm: true}) : this.setState({showFormerAddressForm: false});
    }
  }
  componentDidUpdate() {
    if (this.props.settings.closeForm) {
      this.props.cancel();
    }
  }

  render() {
    let {
      intl,
      individualData: { 
        addressAptSuiteNumber,
        addressCity,
        addressMonths,
        addressYears,
        addressState,
        addressStreet,
        addressZip,
        homeRentOrOwn,
        homeMonthlyRentMortgage,
        homeAdditionalDetails,
        homeIsFullyOwnedNoMortgage,
        formerAddressAptSuiteNumber,
        formerAddressCity,
        formerAddressMonths,
        formerAddressYears,
        formerAddressState,
        formerAddressStreet,
        formerAddressZip,
      },
      settings: { submitDisabled },
      existingCustomerData
    } = this.props
    
    // update variables from existingCustomerData state if existing customer is editing address info form in summary page
    let existingCustomerAddressInfo = {};
    if(this.props.editExistingCustomer) {
      existingCustomerAddressInfo = {...existingCustomerData.addressData};
      existingCustomerAddressInfo.homeIsFullyOwnedNoMortgage = Boolean(existingCustomerAddressInfo.homeIsFullyOwnedNoMortgage);
    }
    
    let additionalFieldsForIndividualCustomer = {}
    // update addtional fields from individual data when new customer is editing address info form in summary page
    if(this.props.settings.editForm) {
      additionalFieldsForIndividualCustomer = {
        homeRentOrOwn: homeRentOrOwn || OWNERSHIP_TYPES.rent,
        homeMonthlyRentMortgage,
        homeAdditionalDetails,
        homeIsFullyOwnedNoMortgage: Boolean(homeIsFullyOwnedNoMortgage),
        formerAddressAptSuiteNumber,
        formerAddressCity,
        formerAddressMonths,
        formerAddressYears,
        formerAddressState,
        formerAddressStreet,
        formerAddressZip,
      }
    }
    return (
      <div className="fortifid-form">
        <PageHeading title={<FormattedMessage id="forms.AddressInfoForm.title" />} />
        <Form
          initialValues={{
            addressAptSuiteNumber,
            addressCity,
            addressMonths,
            addressYears,
            addressState,
            addressStreet,
            addressZip,
            ...existingCustomerAddressInfo,
            ...additionalFieldsForIndividualCustomer
          }}
          onSubmit={!this.props.editExistingCustomer ? this.submit : this.editExistingCustomer}
          render={({ handleSubmit, submitting, values }) => (
            <form onSubmit={handleSubmit}>
              <FormFieldsWrapper>
                <FormField
                  name="addressStreet"
                  data={{
                    label: intl.formatMessage({
                      id: "forms.AddressInfoForm.fields.addressStreet.label",
                    }),
                    maxLength: 100,
                    name: "addressStreet",
                    required: true,
                    type: FIELD_TYPES.text,
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(
                        intl.formatMessage({
                          id: "formErrors.requiredField",
                        })
                      ),
                      Validators.addressStreet(
                        intl.formatMessage({
                          id: "forms.AddressInfoForm.fields.addressStreet.error",
                        })
                      ),
                    ]
                  )}
                />
                <FormField
                  name="addressAptSuiteNumber"
                  data={{
                    label: intl.formatMessage({
                      id: "forms.AddressInfoForm.fields.addressAptSuiteNumber.label",
                    }),
                    maxLength: 50,
                    name: "addressAptSuiteNumber",
                    required: false,
                    type: FIELD_TYPES.text,
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.addressAptSuiteNumber(
                        intl.formatMessage({
                          id: "forms.AddressInfoForm.fields.addressAptSuiteNumber.error",
                        })
                      ),
                    ]
                  )}
                />
                <FormField
                  name="addressCity"
                  data={{
                    label: intl.formatMessage({
                      id: "forms.AddressInfoForm.fields.addressCity.label",
                    }),
                    maxLength: 50,
                    name: "addressCity",
                    required: true,
                    type: FIELD_TYPES.text,
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(
                        intl.formatMessage({
                          id: "formErrors.requiredField",
                        })
                      ),
                      Validators.addressCity(
                        intl.formatMessage({
                          id: "forms.AddressInfoForm.fields.addressCity.error",
                        })
                      ),
                    ]
                  )}
                />
                <div className="fortifid-address-info__fields-container">
                  <FormField
                    name="addressState"
                    isSearchable={true}
                    data={{
                      required: true,
                      name: "addressState",
                      type: FIELD_TYPES.select,
                      label: intl.formatMessage({
                        id: "forms.AddressInfoForm.fields.addressState.label",
                      }),
                      options: ISO_1366_2.map(entry => ({
                        label: entry.code,
                        value: entry.code,
                      })),
                    }}
                    validate={composeValidators(
                      ...[
                        Validators.required(
                          intl.formatMessage({
                            id: "forms.AddressInfoForm.fields.addressState.error",
                          })
                        ),
                      ]
                    )}
                  />
                  <FormField
                    name="addressZip"
                    data={{
                      format: "12345-6789",
                      label: intl.formatMessage({
                        id: "forms.AddressInfoForm.fields.addressZip.label",
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
                            id: "forms.AddressInfoForm.fields.addressZip.error",
                          })
                        ),
                      ]
                    )}
                  />
                </div>
                <div className="fortifid-address-info__question-container">
                  <span>
                    <FormattedMessage id="forms.AddressInfoForm.addressMonthsQuestion" />
                  </span>
                </div>
                <div className="fortifid-address-info__fields-container">
                  <FormField
                    name="addressYears"
                    data={{
                      required: true,
                      maxLength: 3,
                      name: "addressYears",
                      type: FIELD_TYPES.number,
                      label: intl.formatMessage({
                        id: "forms.AddressInfoForm.fields.addressYears.label",
                      }),
                    }}
                    validate={(value, allValues) => composeValidators(
                      ...[Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                      Validators.maxValue(100, intl.formatMessage({id: "forms.AddressInfoForm.fields.addressYears.error"}))
                    ])(value, allValues)}
                  />
                  <FormField
                    name="addressMonths"
                    data={{
                      required: true,
                      maxLength: 2,
                      name: "addressMonths",
                      type: FIELD_TYPES.number,
                      label: intl.formatMessage({
                        id: "forms.AddressInfoForm.fields.addressMonths.label",
                      }),
                    }}
                    validate={(value, allValues) => composeValidators(
                      ...[Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                      Validators.maxValue(11, intl.formatMessage({id: "forms.AddressInfoForm.fields.addressMonths.error"})),
                      ... (allValues.addressMonths == 0 && allValues.addressYears == 0) ? 
                        [Validators.minValue(1, intl.formatMessage({id: "forms.AddressInfoForm.fields.addressMonths.minValueError"}))] : []
                    ])(value, allValues)}
                  />
                </div>
              </FormFieldsWrapper>
              {
                (this.props.editExistingCustomer || this.props.settings.editForm) &&
                <IncomeHousingFormFields data={{intl, values}}/>
              }
              <OnChange name="addressYears">
                {(value, previous) => {
                  if (this.props.settings.editForm || this.props.editExistingCustomer) {
                    //console.log(value);
                    value < 2 ? this.setState({showFormerAddressForm: true}) : this.setState({showFormerAddressForm: false});
                  }
                }}
              </OnChange>
              {
                ((this.props.editExistingCustomer || this.props.settings.editForm) && this.state.showFormerAddressForm) &&
                <FormerAddressInfoFields data={{intl}}/>
              }
              {
                (!this.props.editExistingCustomer && !this.props.settings.editForm) &&
                <FormActionsWrapper>
                  <TertiaryButton size="medium" onClick={this.props.onPrev}>
                    <Icon name="Previous" className="fortifid-icon__previous"/>
                    <FormattedMessage id="prevButton" defaultMessage="Previous" />
                  </TertiaryButton>
                  <ReviewButton backToReview={this.props.onReview} />
                  <PrimaryButton className="cta-button" disabled={submitting || submitDisabled} type="submit" size="medium">
                    <FormattedMessage id="nextButton" defaultMessage="Submit" />
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
                  <PrimaryButton className="cta-button" disabled={submitting || submitDisabled} type="submit" size="medium"  >
                      <FormattedMessage id="saveButton" defaultMessage="Save" />
                  </PrimaryButton>
                </FormActionsWrapper>
              }
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
}))(injectIntl(AddressInfoForm))
