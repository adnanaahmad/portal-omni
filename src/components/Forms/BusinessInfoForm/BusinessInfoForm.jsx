import React, { Component } from "react"
import { connect } from "react-redux"
import { Form, FormSpy } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import moment from "moment"
import { OnChange } from "react-final-form-listeners"
import FormField, { FIELD_TYPES } from "components/Shared/Form/FormField/FormField"
import Icon from "components/Shared/Icon/Icon"
import formatStringByPattern from "format-string-by-pattern"
import { Validators, composeValidators } from "components/Shared/Form/validators"
import PageHeading from "components/PageHeading/PageHeading"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import { FormFieldsWrapper, FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import BusinessTypes from "data/BusinessTypes.json"
import FederalIdNumberTypes from "data/FederalIdNumberTypes.json"
import ISO_1366_2 from "data/iso-3166-2.json"
import TypesOfOwnership from "data/TypesOfOwnership.json"

import "./BusinessInfoForm.scss";
import FormNames from "../../../constants/forms";
import { actionExistingDataFormSubmit } from "../../state/actions"
import { scrollToElement } from "../../Shared/helpers"
import ReviewButton from "../../Shared/Button/ReviewButton"


class BusinessInfoForm extends Component {

  constructor(props) {
    super(props);
    this.state = {formError: undefined, federalIdNumberType: undefined};
    this.businessTypeRef = React.createRef(null);
    this.typeOfOwnershipRef = React.createRef(null);
    this.companyNameRef = React.createRef(null);
    this.doingBusinessAsRef = React.createRef(null);
    this.phoneNumberRef = React.createRef(null);
    this.webSiteRef = React.createRef(null);
    this.addressStreetRef = React.createRef(null);
  }

  submit = async values => {
    values = this.processValuesBeforeSubmit(values);
    this.props.onSubmit(values)
  }

  editExistingCustomer = async values => {
    values = this.processValuesBeforeSubmit(values);
    this.props.dispatch(actionExistingDataFormSubmit(values, { formName: FormNames.FORM_BUSINESS_INFO }));
  }

  processValuesBeforeSubmit(values) {
    if (!values.addressAptSuiteNumber) values.addressAptSuiteNumber = '';
    if (!values.doingBusinessAs) values.doingBusinessAs = '';
    if (values.federalIdNumberType !== FederalIdNumberTypes.EIN) values.federalIdNumber = '';
    if (!values.webSite) values.webSite = '';
    return values;
  }

  componentDidUpdate() {
    if (this.props.settings.closeForm) {
      this.props.cancel();
    }
  }
  // scroll user to error field
  handleClickRef = () => {
    if (!this.state.formError) return;
    
    if (this.state.formError.businessType) {
      scrollToElement(this.businessTypeRef);
    } else if (this.state.formError.typeOfOwnership) {
      scrollToElement(this.typeOfOwnershipRef)
    } else if (this.state.formError.companyName) {
      scrollToElement(this.companyNameRef);
    } else if (this.state.formError.doingBusinessAs) {
      scrollToElement(this.doingBusinessAsRef);
    } else if (this.state.formError.phoneNumber) {
      scrollToElement(this.phoneNumberRef);
    } else if (this.state.formError.webSite) {
      scrollToElement(this.webSiteRef);
    } else if (this.state.formError.addressStreet) {
      scrollToElement(this.addressStreetRef);
    }
  };

  render() {
    let {
      intl,
      businessData: {
        addressAptSuiteNumber,
        addressCity,
        addressState,
        addressStreet,
        addressZip,
        businessType,
        companyName,
        dateEstablished,
        doingBusinessAs,
        federalIdNumber,
        federalIdNumberType,
        phoneNumber,
        registrationState,
        typeOfOwnership,
        webSite,
      },
      settings: { submitDisabled },
      existingCustomerData
    } = this.props

    // update variables from existingCustomerData state if existing customer is editing business info form in summary page
    let existingCustomerBusinessInfo = {};
    if(this.props.editExistingCustomer) existingCustomerBusinessInfo = existingCustomerData.businessData;

    return (
      <div className="fortifid-form">
        <PageHeading title={<FormattedMessage id="forms.BusinessInfoForm.title" />} />
        <Form
          initialValues={{
            addressAptSuiteNumber,
            addressCity,
            addressState,
            addressStreet,
            addressZip,
            businessType,
            companyName,
            dateEstablished,
            doingBusinessAs,
            federalIdNumber,
            federalIdNumberType,
            phoneNumber,
            registrationState,
            typeOfOwnership,
            webSite,
            ...existingCustomerBusinessInfo
          }}
          onSubmit={!this.props.editExistingCustomer ? this.submit : this.editExistingCustomer}
          render={({ handleSubmit, submitting, form, values }) => (
            <form onSubmit={handleSubmit}>
              <FormFieldsWrapper>
                <div ref={this.businessTypeRef}>
                  <FormField
                    name="businessType"
                    isSearchable={true}
                    data={{
                      required: true,
                      name: "businessType",
                      type: FIELD_TYPES.select,
                      label: intl.formatMessage({
                        id: "forms.BusinessInfoForm.fields.businessType.label",
                      }),
                      options: BusinessTypes.map(entry => ({
                        label: entry,
                        value: entry,
                      })),
                    }}
                    validate={composeValidators(
                      ...[
                        Validators.required(
                          intl.formatMessage({
                            id: "forms.BusinessInfoForm.fields.businessType.error",
                          })
                        ),
                      ]
                    )}
                  />
                </div>
                <div ref={this.typeOfOwnershipRef}>
                  <FormField
                    name="typeOfOwnership"
                    isSearchable={true}
                    data={{
                      required: true,
                      name: "typeOfOwnership",
                      type: FIELD_TYPES.select,
                      label: intl.formatMessage({
                        id: "forms.BusinessInfoForm.fields.typeOfOwnership.label",
                      }),
                      options: TypesOfOwnership.map(entry => ({
                        label: entry,
                        value: entry,
                      })),
                    }}
                    validate={composeValidators(
                      ...[
                        Validators.required(
                          intl.formatMessage({
                            id: "forms.BusinessInfoForm.fields.typeOfOwnership.error",
                          })
                        ),
                      ]
                    )}
                  />
                </div>
                <div ref={this.companyNameRef}>
                  <FormField
                    name="companyName"
                    data={{
                      label: intl.formatMessage({
                        id: "forms.BusinessInfoForm.fields.companyName.label",
                      }),
                      maxLength: 100,
                      name: "companyName",
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
                        Validators.companyName(
                          intl.formatMessage({
                            id: "forms.BusinessInfoForm.fields.companyName.error",
                          })
                        ),
                      ]
                    )}
                  />
                </div>
                <div ref={this.doingBusinessAsRef}>
                  <FormField
                    name="doingBusinessAs"
                    data={{
                      label: intl.formatMessage({
                        id: "forms.BusinessInfoForm.fields.doingBusinessAs.label",
                      }),
                      maxLength: 100,
                      name: "doingBusinessAs",
                      required: false,
                      type: FIELD_TYPES.text,
                    }}
                    validate={composeValidators(
                      ...[
                        // Validators.required(
                        //   intl.formatMessage({
                        //     id: "formErrors.requiredField",
                        //   })
                        // ),
                        Validators.dba(
                          intl.formatMessage({
                            id: "forms.BusinessInfoForm.fields.doingBusinessAs.error",
                          })
                        ),
                      ]
                    )}
                  />
                </div>
                <div ref={this.phoneNumberRef}>
                  <FormField
                    name="phoneNumber"
                    required
                    data={{
                      required: true,
                      name: "phoneNumber",
                      type: FIELD_TYPES.phone,
                      country_code: "US",
                      format: "(123) 456-7890",
                      label: intl.formatMessage({
                        id: "forms.BusinessInfoForm.fields.phoneNumber.label",
                      }),
                    }}
                    validate={composeValidators(
                      ...[
                        Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                        Validators.phone(
                          intl.formatMessage({
                            id: "forms.BusinessInfoForm.fields.phoneNumber.error",
                          }),
                          "US"
                        ),
                      ]
                    )}
                  />
                </div>
                <div ref={this.webSiteRef}>
                  <FormField
                    name="webSite"
                    data={{
                      label: intl.formatMessage({
                        id: "forms.BusinessInfoForm.fields.webSite.label",
                      }),
                      maxLength: 100,
                      name: "webSite",
                      required: false,
                      type: FIELD_TYPES.text,
                    }}
                    validate={composeValidators(
                      ...[
                        // Validators.required(
                        //   intl.formatMessage({
                        //     id: "formErrors.requiredField",
                        //   })
                        // ),
                        Validators.website(
                          intl.formatMessage({
                            id: "forms.BusinessInfoForm.fields.webSite.error",
                          })
                        ),
                      ]
                    )}
                  />
                </div>
                <div ref={this.addressStreetRef}>
                  <FormField
                    name="addressStreet"
                    data={{
                      label: intl.formatMessage({
                        id: "forms.BusinessInfoForm.fields.addressStreet.label",
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
                            id: "forms.BusinessInfoForm.fields.addressStreet.error",
                          })
                        ),
                      ]
                    )}
                  />
                </div>
                <FormField
                  name="addressAptSuiteNumber"
                  data={{
                    label: intl.formatMessage({
                      id: "forms.BusinessInfoForm.fields.addressAptSuiteNumber.label",
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
                          id: "forms.BusinessInfoForm.fields.addressAptSuiteNumber.error",
                        })
                      ),
                    ]
                  )}
                />
                <FormField
                  name="addressCity"
                  data={{
                    label: intl.formatMessage({
                      id: "forms.BusinessInfoForm.fields.addressCity.label",
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
                          id: "forms.BusinessInfoForm.fields.addressCity.error",
                        })
                      ),
                    ]
                  )}
                />
                <div className="fortifid-business-info__fields-container">
                  <FormField
                    name="addressState"
                    isSearchable={true}
                    data={{
                      required: true,
                      name: "addressState",
                      type: FIELD_TYPES.select,
                      label: intl.formatMessage({
                        id: "forms.BusinessInfoForm.fields.addressState.label",
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
                            id: "forms.BusinessInfoForm.fields.addressState.error",
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
                        id: "forms.BusinessInfoForm.fields.addressZip.label",
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
                            id: "forms.BusinessInfoForm.fields.addressZip.error",
                          })
                        ),
                      ]
                    )}
                  />
                </div>
                <FormField
                  name="federalIdNumberType"
                  data={{
                    name: "federalIdNumberType",
                    type: FIELD_TYPES.radio,
                    style: "horizontal",
                    label: intl.formatMessage({
                      id: "forms.BusinessInfoForm.fields.federalIdNumberType.label",
                    }),
                    options: [
                      {
                        label: intl.formatMessage({
                          id: "forms.BusinessInfoForm.fields.federalIdNumberType.optionEIN",
                        }),
                        value: FederalIdNumberTypes.EIN,
                      },
                      {
                        label: intl.formatMessage({
                          id: "forms.BusinessInfoForm.fields.federalIdNumberType.optionSSN",
                        }),
                        value: FederalIdNumberTypes.SSN,
                      },
                    ],
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(
                        intl.formatMessage({
                          id: "forms.BusinessInfoForm.fields.federalIdNumberType.error",
                        })
                      ),
                    ]
                  )}
                />
                {
                  (!this.props.editExistingCustomer && !this.props.settings.editForm) &&
                  <div className="fortifid-business-info__hint-container">
                    <span>
                      <FormattedMessage id={`forms.BusinessInfoForm.${this.state.federalIdNumberType === FederalIdNumberTypes.EIN ? 'feid_hint' : 'fssn_hint'}`}/>
                    </span>
                  </div>
                }
                {
                  (this.state.federalIdNumberType === FederalIdNumberTypes.EIN) &&
                  <FormField
                    name="federalIdNumber"
                    pattern={"12-3456789"}
                    disabled={values.federalIdNumberType !== FederalIdNumberTypes.EIN}
                    data={{
                      required: values.federalIdNumberType === FederalIdNumberTypes.EIN,
                      name: "federalIdNumber",
                      type: FIELD_TYPES.masked,
                      label: intl.formatMessage({
                        id: `forms.BusinessInfoForm.fields.EIN.label`,
                      }),
                    }}
                    validate={(value, allValues) =>
                      (allValues.federalIdNumberType === FederalIdNumberTypes.EIN)
                        ? composeValidators(
                          ...[
                            Validators.required(
                              intl.formatMessage({
                                id: "formErrors.requiredField",
                              })
                            ),
                            Validators[String(FederalIdNumberTypes.EIN).toLowerCase()](
                              intl.formatMessage({
                                id: `forms.BusinessInfoForm.fields.EIN.error`,
                              })
                            ),
                          ]
                        )(value, allValues)
                        : undefined
                    }
                  />
                }
                <FormField
                  name="dateEstablished"
                  data={{
                    required: true,
                    name: "dateEstablished",
                    format: "MM/DD/YYYY",
                    type: FIELD_TYPES.formatted_date,
                    label: intl.formatMessage({
                      id: "forms.BusinessInfoForm.fields.dateEstablished.label",
                    }),
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(
                        intl.formatMessage({
                          id: "formErrors.requiredField",
                        })
                      ),
                      Validators.dateRange(
                        intl.formatMessage({
                          id: "forms.BusinessInfoForm.fields.dateEstablished.error",
                        }),
                        "MM/DD/YYYY",
                        moment("1900", "YYYY"),
                        moment()
                      ),
                    ]
                  )}
                />
                <FormField
                  name="registrationState"
                  isSearchable={true}
                  data={{
                    required: true,
                    name: "registrationState",
                    type: FIELD_TYPES.select,
                    label: intl.formatMessage({
                      id: "forms.BusinessInfoForm.fields.registrationState.label",
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
                          id: "forms.BusinessInfoForm.fields.registrationState.error",
                        })
                      ),
                    ]
                  )}
                />
                <OnChange name={"federalIdNumberType"}>
                  {(value, previous) => {
                    if (value !== previous) {
                      form.change(
                        "federalIdNumber",
                        values.federalIdNumber
                          ? formatStringByPattern(
                            values.federalIdNumberType === FederalIdNumberTypes.EIN ? "12-3456789" : "123-45-6789",
                            values.federalIdNumber.replace(/\D+/g, "")
                          )
                          : undefined
                      )
                    }
                  }}
                </OnChange>
              </FormFieldsWrapper>
              {
                (!this.props.editExistingCustomer && !this.props.settings.editForm) &&
                <FormActionsWrapper>
                  <TertiaryButton size="medium" onClick={this.props.onPrev}>
                    <Icon name="Previous" className="fortifid-icon__previous" />
                    <FormattedMessage id="prevButton" defaultMessage="Previous" />
                  </TertiaryButton>
                  <ReviewButton backToReview={this.props.onReview} />
                  <PrimaryButton onClick={this.handleClickRef} className="cta-button" disabled={submitting || submitDisabled} type="submit" size="medium">
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
              <FormSpy
                onChange={props => {
                  this.setState({formError: props.errors, federalIdNumberType: props.values.federalIdNumberType})
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
}))(injectIntl(BusinessInfoForm))
