import React, { Component } from "react"
import { connect } from "react-redux"
import { Form } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import moment from "moment"
import FormField, { FIELD_TYPES } from "components/Shared/Form/FormField/FormField"
import { Validators, composeValidators } from "components/Shared/Form/validators"
import PageHeading from "components/PageHeading/PageHeading"
import { PrimaryButton } from "components/Shared/Button/Button"
import { NavigationLink } from "components/Shared/Link/Link"
import { FormFieldsWrapper } from "components/FormWrappers/FormWrappers"

import "./ReturnLinkForm.scss"

class ReturnLinkForm extends Component {
  submit = values => {
    let arr = values.birthDate.split("/");
    let ele = arr.pop();
    arr.unshift(ele);
    let dob = arr.join("-");
    let body = {
      "ssn": values.federalIdNumberLast4Digits,
      "dob": dob,
      "existing_application_code": values.verficationCode
    }
    this.props.onSubmit(body)
  }

  render() {
    const {
      intl,
      settings: { submitDisabled },
    } = this.props
    return (
      <div className="fortifid-return-form">
        <PageHeading
          title={<FormattedMessage id="forms.ReturnLinkForm.title" />}
          subtitle={<FormattedMessage id="forms.ReturnLinkForm.subtitle" />}
        />
        <Form
          onSubmit={this.submit}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <FormFieldsWrapper>
                <FormField
                  name="verficationCode"
                  data={{
                    maxLength: 6,
                    required: true,
                    name: "verificationCode",
                    type: FIELD_TYPES.number,
                    labelPosition: "left",
                    label: intl.formatMessage({
                      id: "forms.ReturnLinkForm.fields.verificationCode.label"
                    }),
                    hint: intl.formatMessage(
                      { id: "forms.ReturnLinkForm.fields.verificationCode.hint" },
                      {
                        resendCodeLink: (
                          <NavigationLink to="/resendCode">
                            <FormattedMessage id="forms.ReturnLinkForm.fields.verificationCode.resendCodeLink.label" />
                          </NavigationLink>
                        ),
                      }
                    ),
                  }}
                  validate={composeValidators(...[Validators.required(intl.formatMessage({ id: "formErrors.requiredField" }))])}
                />
                <FormField
                  name="federalIdNumberLast4Digits"
                  data={{
                    maxLength: 4,
                    required: true,
                    name: "federalIdNumberLast4Digits",
                    type: FIELD_TYPES.text,
                    label: intl.formatMessage({
                      id: "forms.ReturnLinkForm.fields.federalIdNumberLast4Digits.label",
                    }),
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                      Validators.number(
                        intl.formatMessage({
                          id: "forms.ReturnLinkForm.fields.federalIdNumberLast4Digits.error",
                        })
                      ),
                    ]
                  )}
                />
                <FormField
                  name="birthDate"
                  pattern="MM/DD/YYYY"
                  data={{
                    required: true,
                    name: "birthDate",
                    type: FIELD_TYPES.masked,
                    label: intl.formatMessage({
                      id: "forms.ReturnLinkForm.fields.birthDate.label",
                    }),
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                      Validators.date(
                        intl.formatMessage({
                          id: "forms.ReturnLinkForm.fields.birthDate.error",
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

              <div className="row no-gutters justify-content-center">
                <div className="fortifid-return-form__actions">
                  <PrimaryButton className="cta-button" disabled={submitting || submitDisabled} type="submit" size="medium">
                    <FormattedMessage id="forms.ReturnLinkForm.submitButton" defaultMessage="Submit" />
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
}))(injectIntl(ReturnLinkForm))
