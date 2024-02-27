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
import ReviewButton from "../../Shared/Button/ReviewButton"
import "./DLNForm.scss"



const ISO_1366_2 = require("data/iso-3166-2.json");

export class DLNFormFields extends Component {

  render () {
    const {
      data: {
        intl
      }
    } = this.props
    return(
      <FormFieldsWrapper>
        <FormField
          name="driversLicenseState"
          isSearchable={true}
          data={{
            required: true,
            name: "driversLicenseState",
            type: FIELD_TYPES.select,
            label: intl.formatMessage({
              id: "forms.DLNForm.fields.driversLicenseState.label",
            }),
            options: ISO_1366_2.map(entry => ({
              label: intl.formatMessage({
                id: `ISO_1366_2.US.states.${entry.code}`,
                defaultMessage: entry.name,
              }),
              value: entry.code,
            })),
          }}
          validate={composeValidators(
                ...[
                  Validators.required(
                    intl.formatMessage({
                      id: "forms.DLNForm.fields.driversLicenseState.error",
                    })
                  ),
                ]
              )}
        />
        <FormField
          name="driversLicenseNumber"
          data={{
            required: true,
            name: "driversLicenseNumber",
            type: FIELD_TYPES.text,
            label: intl.formatMessage({
              id: "forms.DLNForm.fields.driversLicenseNumber.label",
            }),
          }}
          validate={composeValidators(
                ...[
                  Validators.required(
                    intl.formatMessage({
                      id: "formErrors.requiredField",
                    })
                  ),
                  Validators.dln(
                    intl.formatMessage({
                      id: "forms.DLNForm.fields.driversLicenseNumber.error",
                    }),
                    "driversLicenseState"
                  ),
                ]
              )}
        />
        <FormField
          name="driversLicenseExpireDate"
          data={{
            required: true,
            name: "driversLicenseExpireDate",
            format: "MM/DD/YYYY",
            type: FIELD_TYPES.formatted_date,
            label: intl.formatMessage({
              id: "forms.DLNForm.fields.driversLicenseExpireDate.label",
            }),
          }}
          validate={composeValidators(
                ...[
                  Validators.required(
                    intl.formatMessage({
                      id: "formErrors.requiredField",
                    })
                  ),
                  Validators.date(
                    intl.formatMessage({
                      id: "forms.DLNForm.fields.driversLicenseExpireDate.error",
                    }),
                    "MM/DD/YYYY",
                    undefined,
                    undefined,
                    "[]"
                  ),
                ]
              )}
        />
      </FormFieldsWrapper>
    )
  }
}

class DLNForm extends Component {
  submit = async values => {  
    this.props.onSubmit(values)
  }


  componentDidMount() {
    const firstField = document.getElementById("driversLicenseState");
    if (firstField) {
      firstField.focus();
    }
  }

  render() {
    const {
      intl,
      individualData: { driversLicenseNumber, driversLicenseState, driversLicenseExpireDate },
      settings: { submitDisabled },
    } = this.props
    return (
      <div className="fortifid-form">
        <PageHeading title={<FormattedMessage id="forms.DLNForm.title" />} />
        <Form
          initialValues={{
            driversLicenseNumber,
            driversLicenseState,
            driversLicenseExpireDate,
          }}
          onSubmit={this.submit}
          render={({ handleSubmit, submitting, values }) => (
            <form onSubmit={handleSubmit}>
              <DLNFormFields data={{intl}}/>
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
}))(injectIntl(DLNForm))
