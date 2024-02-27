import React, { Component } from "react"
import { connect } from "react-redux"
import { Form } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import Icon from "components/Shared/Icon/Icon"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import { FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import PageHeading from "components/PageHeading/PageHeading"

import "./DisclaimerForm.scss"

class DisclaimerForm extends Component {
  submit = values => {
    this.props.onSubmit(values)
  }

  render() {
    return (
      <div className="fortifid-disclaimer-form">
        <PageHeading 
          title={<FormattedMessage id="forms.DisclaimerForm.title" />}
          subtitle={<FormattedMessage id="forms.DisclaimerForm.subtitle" />}
        />
        <Form
          onSubmit={this.submit}
          render={({ handleSubmit, submitting, submitDisabled }) => (
            <form onSubmit={handleSubmit}>
              <FormActionsWrapper>
                {/* <TertiaryButton size="medium" onClick={this.props.onPrev}>
                  <Icon name="Previous" className="fortifid-icon__previous"/>
                  <FormattedMessage id="prevButton" defaultMessage="Previous" />
                </TertiaryButton> */}
                <PrimaryButton className="cta-button" disabled={submitting || submitDisabled} type="submit" size="medium">
                  <FormattedMessage id="forms.DisclaimerForm.submit" defaultMessage="Accept & Continue"/>
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
}))(injectIntl(DisclaimerForm))
