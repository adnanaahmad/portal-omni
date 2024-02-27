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
import ISO_1366_2 from "data/iso-3166-2.json"

import "./FormerAddressInfoForm.scss"
import { calculateMonthsForLength } from "../../Shared/helpers"
import ReviewButton from "../../Shared/Button/ReviewButton"

export function processFormerAddressForm(values) {
  if(!values.formerAddressAptSuiteNumber) values.formerAddressAptSuiteNumber = "";
  if(!values.formerAddressMonths) values.formerAddressMonths = 0;
  if(!values.formerAddressYears) values.formerAddressYears = 0;
  values.formerAddressLivePeriod = calculateMonthsForLength(values.formerAddressMonths, values.formerAddressYears);
  return values;
}

export class FormerAddressInfoFields extends Component {

  render () {
    const {
      data: {
        intl
      }
    } = this.props
    return(
      <FormFieldsWrapper>
        <div className="fortifid-former-address-info__question-container">
          <span>
            <FormattedMessage id="forms.FormerAddressInfoForm.formerAddressBlockTitle" />
          </span>
        </div>

        <FormField
          name="formerAddressStreet"
          data={{
            label: intl.formatMessage({
              id: "forms.FormerAddressInfoForm.fields.formerAddressStreet.label",
            }),
            maxLength: 100,
            name: "formerAddressStreet",
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
                  id: "forms.FormerAddressInfoForm.fields.formerAddressStreet.error",
                })
              ),
            ]
          )}
        />
        <FormField
          name="formerAddressAptSuiteNumber"
          data={{
            label: intl.formatMessage({
              id: "forms.FormerAddressInfoForm.fields.formerAddressAptSuiteNumber.label",
            }),
            maxLength: 50,
            name: "formerAddressAptSuiteNumber",
            required: false,
            type: FIELD_TYPES.text,
          }}
          validate={composeValidators(
            ...[
              Validators.addressAptSuiteNumber(
                intl.formatMessage({
                  id: "forms.FormerAddressInfoForm.fields.formerAddressAptSuiteNumber.error",
                })
              ),
            ]
          )}
        />
        <FormField
          name="formerAddressCity"
          data={{
            label: intl.formatMessage({
              id: "forms.FormerAddressInfoForm.fields.formerAddressCity.label",
            }),
            maxLength: 50,
            name: "formerAddressCity",
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
                  id: "forms.FormerAddressInfoForm.fields.formerAddressCity.error",
                })
              ),
            ]
          )}
        />
        <div className="fortifid-former-address-info__fields-container">
          <FormField
            name="formerAddressState"
            isSearchable={true}
            data={{
              required: true,
              name: "formerAddressState",
              type: FIELD_TYPES.select,
              label: intl.formatMessage({
                id: "forms.FormerAddressInfoForm.fields.formerAddressState.label",
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
                    id: "forms.FormerAddressInfoForm.fields.formerAddressState.error",
                  })
                ),
              ]
            )}
          />
          <FormField
            name="formerAddressZip"
            data={{
              format: "12345-6789",
              label: intl.formatMessage({
                id: "forms.FormerAddressInfoForm.fields.formerAddressZip.label",
              }),
              name: "formerAddressZip",
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
                    id: "forms.FormerAddressInfoForm.fields.formerAddressZip.error",
                  })
                ),
              ]
            )}
          />
        </div>
        <div className="fortifid-address-info__question-container">
          <span>
            <FormattedMessage id="forms.FormerAddressInfoForm.formerAddressMonthsQuestion" />
          </span>
        </div>
        <div className="fortifid-former-address-info__fields-container">
          <FormField
            name="formerAddressYears"
            data={{
              required: false,
              maxLength: 3,
              name: "formerAddressYears",
              type: FIELD_TYPES.number,
              label: intl.formatMessage({
                id: "forms.FormerAddressInfoForm.fields.formerAddressYears.label",
              }),
            }}
            validate={composeValidators(...[Validators.maxValue(100, intl.formatMessage({id: "forms.FormerAddressInfoForm.fields.formerAddressYears.error"}))])}
          />
          <FormField
            name="formerAddressMonths"
            data={{
              required: false,
              maxLength: 2,
              name: "formerAddressMonths",
              type: FIELD_TYPES.number,
              label: intl.formatMessage({
                id: "forms.FormerAddressInfoForm.fields.formerAddressMonths.label",
              }),
            }}
            validate={composeValidators(...[Validators.maxValue(11, intl.formatMessage({id: "forms.FormerAddressInfoForm.fields.formerAddressMonths.error"}))])}
          />
        </div>
      </FormFieldsWrapper>
    )
  }
}

class FormerAddressInfoForm extends Component {
  submit = values => {
    values = processFormerAddressForm(values);
    this.props.onSubmit(values)
  }

  componentDidMount() {
    const firstField = document.getElementById("formerAddressStreet");
    if (firstField) {
      firstField.focus();
    }
  }

  render() {
    const {
      intl,
      individualData: {
        formerAddressAptSuiteNumber,
        formerAddressCity,
        formerAddressMonths,
        formerAddressYears,
        formerAddressState,
        formerAddressStreet,
        formerAddressZip,
      },
      settings: { submitDisabled },
    } = this.props
    return (
      <div className="fortifid-form">
        <PageHeading title={<FormattedMessage id="forms.FormerAddressInfoForm.title" />} />
        <Form
          initialValues={{
            formerAddressAptSuiteNumber,
            formerAddressCity,
            formerAddressMonths,
            formerAddressYears,
            formerAddressState,
            formerAddressStreet,
            formerAddressZip,
          }}
          onSubmit={this.submit}
          render={({ handleSubmit, submitting, form, values }) => (
            <form onSubmit={handleSubmit}>
              <FormerAddressInfoFields data={{intl}}/>
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
}))(injectIntl(FormerAddressInfoForm))
