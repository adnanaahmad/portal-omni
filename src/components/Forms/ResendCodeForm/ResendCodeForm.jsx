import React, { Component } from "react"
import { connect } from "react-redux"
import { Form } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import FormField, { FIELD_TYPES } from "components/Shared/Form/FormField/FormField"
import { Validators, composeValidators } from "components/Shared/Form/validators"
import PageHeading from "components/PageHeading/PageHeading"
import { PrimaryButton } from "components/Shared/Button/Button"
import { FormFieldsWrapper } from "components/FormWrappers/FormWrappers"

import "./ResendCodeForm.scss"

class ResendCodeForm extends Component {
  submit = values => {
    this.props.onSubmit(values)
  }

  render() {
    const {
      intl,
      settings: { submitDisabled },
    } = this.props
    return (
      <div className="fortifid-resend-form">
        <PageHeading
          title={<FormattedMessage id="forms.ResendCodeForm.title" />}
          subtitle={<FormattedMessage id="forms.ResendCodeForm.subtitle" />}
        />
        <Form
          onSubmit={this.submit}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <FormFieldsWrapper>
                <FormField
                  name="emailAddress"
                  required
                  data={{
                    required: true,
                    name: "emailAddress",
                    type: FIELD_TYPES.email,
                    maxLength: 320,
                    label: intl.formatMessage({
                      id: "forms.ResendCodeForm.fields.emailAddress.label",
                    }),
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                      Validators.email(
                        intl.formatMessage({
                          id: "forms.ResendCodeForm.fields.emailAddress.error",
                        })
                      ),
                    ]
                  )}
                  suggestion={value =>
                    intl.formatMessage(
                      {
                        id: "forms.ResendCodeForm.fields.emailAddress.suggestion",
                      },
                      { email: value.full }
                    )
                  }
                />
              </FormFieldsWrapper>

              <div className="row no-gutters justify-content-center">
                <div className="fortifid-resend-form__actions">
                  <PrimaryButton className="cta-button" disabled={submitting || submitDisabled} type="submit" size="medium">
                    <FormattedMessage id="forms.ResendCodeForm.submitButton" defaultMessage="Submit" />
                  </PrimaryButton>
                </div>
              </div>
            </form>
          )}
        />
      </div>
    )
  }
}

export default connect(state => ({
  settings: state.settings,
}))(injectIntl(ResendCodeForm))
