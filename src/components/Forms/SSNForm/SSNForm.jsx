import React, { Component } from "react"
import { connect } from "react-redux"
import { Form } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import moment from "moment"
import FormField from "components/Shared/Form/FormField/FormField"
import Icon from "components/Shared/Icon/Icon"
import { Validators, composeValidators } from "components/Shared/Form/validators"
import PageHeading from "components/PageHeading/PageHeading"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import { FormFieldsWrapper, FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import { FIELD_TYPES } from "../../Shared/Form/FormField/FormField"
import ReviewButton from "../../Shared/Button/ReviewButton"
import "./SSNForm.scss"

export class SSNFormFields extends Component {

  render () {
    const {
      data: {
        intl
      }
    } = this.props
    return(
      <FormFieldsWrapper>
        <FormField
          name="federalIdNumber"
          data={{
            required: true,
            name: "federalIdNumber",
            type: FIELD_TYPES.masked,
            label: intl.formatMessage({
              id: "forms.SSNForm.fields.federalIdNumber.label",
            }),
          }}
          validate={composeValidators(
            ...[
              Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
              Validators.ssn(
                intl.formatMessage({
                  id: "forms.SSNForm.fields.federalIdNumber.error",
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
              id: "forms.SSNForm.fields.birthDate.label",
            }),
          }}
          validate={composeValidators(
            ...[
              Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
              Validators.date(
                intl.formatMessage({
                  id: "forms.SSNForm.fields.birthDate.error",
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
        <div className="fortifid-ssn-form__is-citizen">
          <FormField
            name="isUSCitizen"
            data={{
              name: "isUSCitizen",
              type: FIELD_TYPES.radio,
              label: intl.formatMessage({
                id: "forms.SSNForm.fields.isUSCitizen.label",
              }),
              style: "responsive",
              options: [
                {
                  label: intl.formatMessage({
                    id: "forms.SSNForm.fields.isUSCitizen.optionTrue",
                  }),
                  value: true,
                },
                {
                  label: intl.formatMessage({
                    id: "forms.SSNForm.fields.isUSCitizen.optionFalse",
                  }),
                  value: false,
                },
              ],
            }}
            validate={composeValidators(...[Validators.boolean(intl.formatMessage({ id: "formErrors.requiredField" }))])}
          />
        </div>
      </FormFieldsWrapper>
    )
  }
}

class SSNForm extends Component {
  submit = async values => {
    this.props.onSubmit(values)
  }

  render() {
    const {
      intl,
      individualData: { firstName, federalIdNumber, birthDate, isUSCitizen },
      settings: { submitDisabled },
    } = this.props
    return (
      <div className="fortifid-ssn-form">
        <PageHeading title={<FormattedMessage id="forms.SSNForm.title" values={{ name: firstName }} />} />
        <Form
          initialValues={{
            federalIdNumber,
            birthDate,
            isUSCitizen,
          }}
          onSubmit={this.submit}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <SSNFormFields data={{intl}}/>
              <FormActionsWrapper>
                <TertiaryButton size="medium" onClick={this.props.onPrev}>
                  <Icon name="Previous" className="fortifid-icon__previous" />
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
}))(injectIntl(SSNForm))
