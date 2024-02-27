import React, { Component } from "react"
import { connect } from "react-redux"
import { navigate } from "gatsby"
import { Form, FormSpy } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import FormField, { FIELD_TYPES } from "components/Shared/Form/FormField/FormField"
import { FormFieldsWrapper, FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import PageHeading from "components/PageHeading/PageHeading"
import LOAN_TYPES from "data/LoanTypes"
import LoanCreditCardIcon from "static/images/loan-credit-card-icon.svg"
import LoanPersonalIcon from "static/images/loan-personal-icon.svg"
import LoanSmallBusinessAndEquipmentIcon from "static/images/loan-small-business-and-equipment-icon.svg"
import { OnChange } from "react-final-form-listeners"
import { actionApplicationInitialize } from "components/state/actions"
import Icon from "components/Shared/Icon/Icon"
// import "./GetStartedForm.scss"
// import "../ExistingCustomerForm/ExistingCustomerForm.scss"
import "../YesOrNoForm/YesOrNoForm.scss"
import { clearLocalStorage } from "../../Shared/helpers"

class YesOrNo extends Component {
  submit = values => {
    clearLocalStorage();
    this.props.onSubmit(values)
  }

  constructor(props) {
    super(props);
    this.state = {
      pristine: true
    };
  }

  render() {
    const {
      intl,
      settings: { submitDisabled },
    } = this.props
    return (
      <div className="fortifid-existing-cutomer-type">
        <PageHeading
          title={<FormattedMessage id="forms.ExistingCustomerForm.title" />}
          subtitle={<FormattedMessage id="forms.ExistingCustomerForm.subtitle" />}
        />
        <Form
          onSubmit={this.submit}
          render={({ handleSubmit, pristine, submitting, form, values }) => (
            <form onSubmit={handleSubmit}>
              <FormField
                className= {`existingCustomer-selection ${this.state.pristine ? 'selected' : 'notSelected'}`}
                data={{
                  name: "existingCustmerTypes",
                  options: [
                    {
                      label: intl.formatMessage({
                        id: "forms.ExistingCustomerForm.existingCustmerTypes.yes",
                      }),
                      value: true,
                    },
                    {
                      label: intl.formatMessage({
                        id: "forms.ExistingCustomerForm.existingCustmerTypes.no",
                      }),
                      value: false,
                    },
                  ],
                  required: true,
                  type: FIELD_TYPES.radio,
                }}
              />
              {!this.state.pristine ?
                <p className="error-text">Please select an option</p>
                : null
              }
              <div className="row no-gutters action-buttons">
                <TertiaryButton className="fortifid-existing-customer-form__button" size="medium" onClick={this.props.onPrev}>
                  <Icon name="Previous" className="fortifid-icon__previous" />
                  <FormattedMessage id="prevButton" defaultMessage="Previous" />
                </TertiaryButton>
                <PrimaryButton
                  className="fortifid-existing-customer-form__button"
                  type={submitting || pristine ? "button" : "submit"}
                  size="medium"
                  onClick={() => this.setState({ count: this.state.pristine = submitting || pristine ? false : true })}
                >
                  <FormattedMessage id="nextButton" defaultMessage="Submit" />
                  <Icon name="Next" className="fortifid-icon__next" />
                </PrimaryButton>
              </div>
              <FormActionsWrapper className="row no-gutters justify-content-center">
                <TertiaryButton
                  onClick={() => {
                    navigate("/return")
                  }}
                  size="medium"
                >
                  <FormattedMessage id="continueButton" defaultMessage="Continue with an existing application" />
                </TertiaryButton>
              </FormActionsWrapper>
              <FormSpy onChange={() => this.setState({ count: this.state.pristine = true })} />
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
}))(injectIntl(YesOrNo))


