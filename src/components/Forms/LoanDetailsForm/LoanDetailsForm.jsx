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
import DemoDropdown from "../../../data/DemoDropdown.json"
import "./LoanDetailsForm.scss"
import { actionFillDemoData } from "../../state/actions"
import ReviewButton from "../../Shared/Button/ReviewButton"
const LoanPurposes = require("data/LoanPurposes.json");
const LoanTypes = require("data/LoanTypes.json");
class LoanDetailsForm extends Component {

  submit = async values => {
    this.props.onSubmit(values)
  }

  componentDidMount() {
    const firstField = document.getElementById("loanAmount");
    if (firstField) {
      firstField.focus();
    }
  }

  render() {
    const {
      intl,
      applicationData: { loanAmount, loanPurpose },
      settings: { submitDisabled },
    } = this.props

    const loanPurposes = this.props.applicationData.loanType === LoanTypes.personal_loan ? LoanPurposes.personal_loan : LoanPurposes.small_business;
    var DemoData = DemoDropdown.existingdata;

    const handleDropDown = (event) => {
      let result = DemoDropdown["existingdata"].filter((el) => {
        console.log(el.id, event.target.value);
        if (el.id == event.target.value) {
          return el;
        }
      })
      if (result) {
        this.props.dispatch(actionFillDemoData(result[0]))
      }
    }

    return (
      <div className="fortifid-form">
        <PageHeading title={<FormattedMessage id="forms.LoanDetailsForm.title" />} />
        <Form
          initialValues={{
            loanAmount,
            loanPurpose,
          }}
          onSubmit={this.submit}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <FormFieldsWrapper>
                {
                  (this.props.applicationData.flowType !== "Existing Customer" && this.props.individualData.isDemoMode) && <>
                    <label for="demoData"></label>
                    <select name="demodata" id="demodata" onChange={handleDropDown}
                      style={{
                        width: "100%",
                        margin: "20px 0px",
                        padding: "15px 5px",
                        borderRadius: 5,
                        border: "solid 1px #c2d2d9"
                      }}>
                      <option value="">Select Demo Data</option>
                      {DemoData.filter(data => {
                        return data.type === this.props.applicationData.loanType;
                      }).map((curr, index) => {
                    return <option key={index} value={curr.id}>{curr.demo_applicant}</option>
                  })}
                    </select></>
                }

                <FormField
                  name="loanAmount"
                  data={{
                    allowDecimals: false,
                    allowNegativeValue: false,
                    disableAbbreviations: true,
                    intlConfig: { locale: intl.locale, currency: "USD" },
                    label: intl.formatMessage({
                      id: "forms.LoanDetailsForm.fields.loanAmount.label",
                    }),
                    maxLength: 12,
                    name: "loanAmount",
                    required: true,
                    type: FIELD_TYPES.currency,
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                      Validators.number(
                        intl.formatMessage({
                          id: "forms.LoanDetailsForm.fields.loanAmount.error",
                        })
                      ),
                      Validators.minValue(500, intl.formatMessage({id: "forms.LoanDetailsForm.fields.loanAmount.minValueError"}))
                    ]
                  )}
                />
                <FormField
                  name="loanPurpose"
                  isSearchable={true}
                  data={{
                    label: intl.formatMessage({
                      id: "forms.LoanDetailsForm.fields.loanPurpose.label",
                    }),
                    name: "loanPurpose",
                    options: loanPurposes.map(option => ({
                      label: intl.formatMessage({
                        id: `LoanPurposes."${option}"`,
                        defaultMessage: option,
                      }),
                      value: option,
                    })),
                    required: true,
                    type: FIELD_TYPES.select,
                  }}
                  validate={composeValidators(
                    ...[
                      Validators.required(
                        intl.formatMessage({
                          id: "forms.LoanDetailsForm.fields.loanPurpose.error",
                        })
                      ),
                    ]
                  )}
                />
              </FormFieldsWrapper>
              <FormActionsWrapper>
                <TertiaryButton size="medium" onClick={this.props.onPrev}>
                  <Icon name="Previous" className="fortifid-icon__previous" />
                  <FormattedMessage id="prevButton" defaultMessage="Previous" />
                </TertiaryButton>
                {this.props.applicationData.flowType !== LoanTypes.existing_customer &&
                  <ReviewButton backToReview={this.props.onReview} />
                }
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
}))(injectIntl(LoanDetailsForm))
