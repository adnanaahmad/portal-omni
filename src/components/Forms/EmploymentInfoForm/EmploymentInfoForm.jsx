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
import EmploymentStatuses from "data/EmploymentStatuses.json"
import ISO_1366_2 from "data/iso-3166-2.json"
import beautifyPhoneNumber from "../../../constants/beautifyPhoneNumber";
import FormNames from "../../../constants/forms";

import "./EmploymentInfoForm.scss"
import { actionExistingDataFormSubmit } from "../../state/actions"
import { calculateMonthsForLength } from "../../Shared/helpers"
import ReviewButton from "../../Shared/Button/ReviewButton"
class EmploymentInfoForm extends Component {
  submit = async values => {
    values = this.processValuesBeforeSubmit(values);
    this.props.onSubmit(values)
  }

  editExistingCustomer = async values => {
    values = this.processValuesBeforeSubmit(values);
    this.props.dispatch(actionExistingDataFormSubmit(values, { formName: FormNames.FORM_EMPLOYMENT_INFO }));
  }

  componentDidUpdate() {
    if (this.props.settings.closeForm) {
      this.props.cancel();
    }
  }

  processValuesBeforeSubmit(values) {
    values = this.handleUnemploymentCase(values);
    if (!values.employmentAddressAptSuiteNumber) values.employmentAddressAptSuiteNumber = '';
    if (values.employmentStatus !== EmploymentStatuses.UNEMPLOYED) values.employmentLength = calculateMonthsForLength(values.employmentMonths, values.employmentYears);
    return values;
  }

  handleUnemploymentCase (values) {
    if (values.employmentStatus === EmploymentStatuses.UNEMPLOYED) {
      values.employmentAddressAptSuiteNumber = '';
      values.employmentAddressCity = '';
      values.employmentAddressState = '';
      values.employmentAddressStreet = '';
      values.employmentAddressZip = '';
      values.employmentEmployerName = '';
      values.employmentJobTitle = '';
      values.employmentMonths = '';
      values.employmentYears = '';
      values.employmentPhoneNumber = '';
      values.employmentLength = '';
    }
    return values;
  }

  render() {
    let {
      intl,
      individualData: {
        employmentAddressAptSuiteNumber,
        employmentAddressCity,
        employmentAddressState,
        employmentAddressStreet,
        employmentAddressZip,
        employmentEmployerName,
        employmentJobTitle,
        employmentMonths,
        employmentYears,
        employmentPhoneNumber,
        employmentStatus,
      },
      settings: { submitDisabled },
      existingCustomerData
    } = this.props

    // update variables from existingCustomerData state if existing customer is editing employment info form in summary page
    let existingCustomerEmploymentInfo = {};
    if(this.props.editExistingCustomer) existingCustomerEmploymentInfo = existingCustomerData.employmentData;

    //TODO:
    employmentPhoneNumber = beautifyPhoneNumber(employmentPhoneNumber);

    return (
      <div className="fortifid-form">
        <PageHeading title={<FormattedMessage id="forms.EmploymentInfoForm.title" />} />
        <Form
          initialValues={{
            employmentAddressAptSuiteNumber,
            employmentAddressCity,
            employmentAddressState,
            employmentAddressStreet,
            employmentAddressZip,
            employmentEmployerName,
            employmentJobTitle,
            employmentMonths,
            employmentYears,
            employmentPhoneNumber,
            employmentStatus,
            ...existingCustomerEmploymentInfo
          }}
          onSubmit={!this.props.editExistingCustomer ? this.submit : this.editExistingCustomer}
          render={({ handleSubmit, submitting, values }) => {
            const disabledIfUnemployed = values.employmentStatus === EmploymentStatuses.UNEMPLOYED
            return (
              <form onSubmit={handleSubmit}>
                <FormFieldsWrapper>
                  <FormField
                    name="employmentStatus"
                    isSearchable={true}
                    data={{
                      required: true,
                      name: "employmentStatus",
                      type: FIELD_TYPES.select,
                      label: intl.formatMessage({
                        id: "forms.EmploymentInfoForm.fields.employmentStatus.label",
                      }),
                      options: Object.values(EmploymentStatuses).map(entry => ({
                        label: entry,
                        value: entry,
                      })),
                    }}
                    validate={composeValidators(
                      ...[
                        Validators.required(
                          intl.formatMessage({
                            id: "forms.EmploymentInfoForm.fields.employmentStatus.error",
                          })
                        ),
                      ]
                    )}
                  />
                  <FormField
                    name="employmentJobTitle"
                    disabled={disabledIfUnemployed}
                    data={{
                      label: intl.formatMessage({
                        id: "forms.EmploymentInfoForm.fields.employmentJobTitle.label",
                      }),
                      maxLength: 50,
                      name: "employmentJobTitle",
                      required: !disabledIfUnemployed,
                      type: FIELD_TYPES.text,
                    }}
                    validate={(value, allValues) =>
                      allValues.employmentStatus !== EmploymentStatuses.UNEMPLOYED
                        ? composeValidators(
                            ...[
                              Validators.required(
                                intl.formatMessage({
                                  id: "formErrors.requiredField",
                                })
                              ),
                              Validators.jobTitle(
                                intl.formatMessage({
                                  id: "forms.EmploymentInfoForm.fields.employmentJobTitle.error",
                                })
                              ),
                            ]
                          )(value, allValues)
                        : undefined
                    }
                  />
                  <FormField
                    name="employmentEmployerName"
                    disabled={disabledIfUnemployed}
                    data={{
                      label: intl.formatMessage({
                        id: "forms.EmploymentInfoForm.fields.employmentEmployerName.label",
                      }),
                      maxLength: 50,
                      name: "employmentEmployerName",
                      required: !disabledIfUnemployed,
                      type: FIELD_TYPES.text,
                    }}
                    validate={(value, allValues) =>
                      allValues.employmentStatus !== EmploymentStatuses.UNEMPLOYED
                        ? composeValidators(
                            ...[
                              Validators.required(
                                intl.formatMessage({
                                  id: "formErrors.requiredField",
                                })
                              ),
                              Validators.employerName(
                                intl.formatMessage({
                                  id: "forms.EmploymentInfoForm.fields.employmentEmployerName.error",
                                }),
                                /^[A-Za-z0-9 -.]+$/,
                                50
                              ),
                            ]
                          )(value, allValues)
                        : undefined
                    }
                  />
                  <FormField
                    name="employmentPhoneNumber"
                    disabled={disabledIfUnemployed}
                    required
                    data={{
                      required: !disabledIfUnemployed,
                      name: "employmentPhoneNumber",
                      type: FIELD_TYPES.phone,
                      country_code: "US",
                      format: "(123) 456-7890",
                      label: intl.formatMessage({
                        id: "forms.EmploymentInfoForm.fields.employmentPhoneNumber.label",
                      }),
                    }}
                    validate={(value, allValues) =>
                      allValues.employmentStatus !== EmploymentStatuses.UNEMPLOYED
                        ? composeValidators(
                            ...[
                              Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                              Validators.phone(
                                intl.formatMessage({
                                  id: "forms.EmploymentInfoForm.fields.employmentPhoneNumber.error",
                                }),
                                "US"
                              ),
                            ]
                          )(value, allValues)
                        : undefined
                    }
                  />
                  <div className="fortifid-employment-info__subtitle-container">
                    <span>
                      <FormattedMessage id="forms.EmploymentInfoForm.lengthSubtitle" />
                    </span>
                  </div>
                  <div className="fortifid-employment-info__fields-container">
                    <FormField
                      name="employmentYears"
                      disabled={disabledIfUnemployed}
                      data={{
                        required: !disabledIfUnemployed,
                        maxLength: 3,
                        name: "employmentYears",
                        type: FIELD_TYPES.number,
                        label: intl.formatMessage({
                          id: "forms.EmploymentInfoForm.fields.employmentYears.label",
                        }),
                      }}
                      validate={(value, allValues) =>
                        allValues.employmentStatus !==
                        EmploymentStatuses.UNEMPLOYED
                          ? composeValidators(
                              ...[
                                Validators.required(
                                  intl.formatMessage({
                                    id: "formErrors.requiredField",
                                  })
                                ),
                                Validators.maxValue(
                                  100,
                                  intl.formatMessage({
                                    id: "forms.EmploymentInfoForm.fields.employmentYears.error",
                                  })
                                ),
                              ]
                            )(value, allValues)
                          : undefined
                      }
                    />
                    <FormField
                      name="employmentMonths"
                      disabled={disabledIfUnemployed}
                      data={{
                        required: !disabledIfUnemployed,
                        maxLength: 2,
                        name: "employmentMonths",
                        type: FIELD_TYPES.number,
                        label: intl.formatMessage({
                          id: "forms.EmploymentInfoForm.fields.employmentMonths.label",
                        }),
                      }}
                      validate={(value, allValues) =>
                        allValues.employmentStatus !==
                        EmploymentStatuses.UNEMPLOYED
                          ? composeValidators(
                              ...[
                                Validators.required(
                                  intl.formatMessage({
                                    id: "formErrors.requiredField",
                                  })
                                ),
                                Validators.maxValue(
                                  11,
                                  intl.formatMessage({
                                    id: "forms.EmploymentInfoForm.fields.employmentMonths.error",
                                  })
                                ),
                                ...(allValues.employmentMonths == 0 &&
                                allValues.employmentYears == 0
                                  ? [
                                      Validators.minValue(
                                        1,
                                        intl.formatMessage({
                                          id: "forms.EmploymentInfoForm.fields.employmentMonths.minValueError",
                                        })
                                      ),
                                    ]
                                  : []),
                              ]
                            )(value, allValues)
                          : undefined
                      }
                    />
                  </div>
                  <div className="fortifid-employment-info__subtitle-container">
                    <span>
                      <FormattedMessage id="forms.EmploymentInfoForm.subtitle" />
                    </span>
                  </div>
                  <FormField
                    name="employmentAddressStreet"
                    disabled={disabledIfUnemployed}
                    data={{
                      label: intl.formatMessage({
                        id: "forms.EmploymentInfoForm.fields.employmentAddressStreet.label",
                      }),
                      maxLength: 100,
                      name: "employmentAddressStreet",
                      required: !disabledIfUnemployed,
                      type: FIELD_TYPES.text,
                    }}
                    validate={(value, allValues) =>
                      allValues.employmentStatus !== EmploymentStatuses.UNEMPLOYED
                        ? composeValidators(
                            ...[
                              Validators.required(
                                intl.formatMessage({
                                  id: "formErrors.requiredField",
                                })
                              ),
                              Validators.addressStreet(
                                intl.formatMessage({
                                  id: "forms.EmploymentInfoForm.fields.employmentAddressStreet.error",
                                })
                              ),
                            ]
                          )(value, allValues)
                        : undefined
                    }
                  />
                  <FormField
                    name="employmentAddressAptSuiteNumber"
                    disabled={disabledIfUnemployed}
                    data={{
                      label: intl.formatMessage({
                        id: "forms.EmploymentInfoForm.fields.employmentAddressAptSuiteNumber.label",
                      }),
                      maxLength: 50,
                      name: "employmentAddressAptSuiteNumber",
                      required: false,
                      type: FIELD_TYPES.text,
                    }}
                    validate={(value, allValues) =>
                      allValues.employmentStatus !== EmploymentStatuses.UNEMPLOYED
                        ? composeValidators(
                            ...[
                              Validators.addressAptSuiteNumber(
                                intl.formatMessage({
                                  id: "forms.EmploymentInfoForm.fields.employmentAddressAptSuiteNumber.error",
                                })
                              ),
                            ]
                          )(value, allValues)
                        : undefined
                    }
                  />
                  <FormField
                    name="employmentAddressCity"
                    disabled={disabledIfUnemployed}
                    data={{
                      label: intl.formatMessage({
                        id: "forms.EmploymentInfoForm.fields.employmentAddressCity.label",
                      }),
                      maxLength: 50,
                      name: "employmentAddressCity",
                      required: !disabledIfUnemployed,
                      type: FIELD_TYPES.text,
                    }}
                    validate={(value, allValues) =>
                      allValues.employmentStatus !== EmploymentStatuses.UNEMPLOYED
                        ? composeValidators(
                            ...[
                              Validators.required(
                                intl.formatMessage({
                                  id: "formErrors.requiredField",
                                })
                              ),
                              Validators.addressCity(
                                intl.formatMessage({
                                  id: "forms.EmploymentInfoForm.fields.employmentAddressCity.error",
                                })
                              ),
                            ]
                          )(value, allValues)
                        : undefined
                    }
                  />
                  <div className="fortifid-employment-info__fields-container">
                    <FormField
                      name="employmentAddressState"
                      disabled={disabledIfUnemployed}
                      isSearchable={true}
                      data={{
                        required: !disabledIfUnemployed,
                        name: "employmentAddressState",
                        type: FIELD_TYPES.select,
                        label: intl.formatMessage({
                          id: "forms.EmploymentInfoForm.fields.employmentAddressState.label",
                        }),
                        options: ISO_1366_2.map(entry => ({
                          label: entry.code,
                          value: entry.code,
                        })),
                      }}
                      validate={(value, allValues) =>
                        allValues.employmentStatus !== EmploymentStatuses.UNEMPLOYED
                          ? composeValidators(
                              ...[
                                Validators.required(
                                  intl.formatMessage({
                                    id: "forms.EmploymentInfoForm.fields.employmentAddressState.error",
                                  })
                                ),
                              ]
                            )(value, allValues)
                          : undefined
                      }
                    />
                    <FormField
                      name="employmentAddressZip"
                      disabled={disabledIfUnemployed}
                      data={{
                        format: "12345-6789",
                        label: intl.formatMessage({
                          id: "forms.EmploymentInfoForm.fields.employmentAddressZip.label",
                        }),
                        name: "employmentAddressZip",
                        required: !disabledIfUnemployed,
                        type: FIELD_TYPES.phone,
                        maxLength: 10,
                      }}
                      validate={(value, allValues) =>
                        allValues.employmentStatus !== EmploymentStatuses.UNEMPLOYED
                          ? composeValidators(
                              ...[
                                Validators.required(
                                  intl.formatMessage({
                                    id: "formErrors.requiredField",
                                  })
                                ),
                                Validators.addressZip(
                                  intl.formatMessage({
                                    id: "forms.EmploymentInfoForm.fields.employmentAddressZip.error",
                                  })
                                ),
                              ]
                            )(value, allValues)
                          : undefined
                      }
                    />
                  </div>
                </FormFieldsWrapper>
                {
                  (!this.props.editExistingCustomer && !this.props.settings.editForm) &&
                  <FormActionsWrapper>
                    <TertiaryButton size="medium" onClick={this.props.onPrev}>
                      <Icon name="Previous" className="fortifid-icon__previous"/>
                    <FormattedMessage id="prevButton" defaultMessage="Previous" />
                    </TertiaryButton>
                    <ReviewButton backToReview={this.props.onReview} />
                    <PrimaryButton className="cta-button" disabled={submitting || submitDisabled} type="submit" size="medium">
                      <FormattedMessage id="nextButton" defaultMessage="Review Application" />
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
            )
          }}
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
}))(injectIntl(EmploymentInfoForm))
