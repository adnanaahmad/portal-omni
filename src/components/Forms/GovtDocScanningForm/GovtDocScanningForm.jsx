import React, { Component } from "react"
import { connect } from "react-redux"
import { navigate } from "gatsby"
import { Form } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import Icon from "components/Shared/Icon/Icon"
import {  FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import FormField, { FIELD_TYPES } from "components/Shared/Form/FormField/FormField"
import PageHeading from "components/PageHeading/PageHeading"
import LOAN_TYPES from "data/LoanTypes"
import CameraIcon from "static/images/icons/camera.svg"
import KeypadIcon from "static/images/icons/keypad.svg"
import { OnChange } from "react-final-form-listeners"
import { actionApplicationInitialize } from "components/state/actions"
import "./GovtDocScanningForm.scss"

class GovtDocScanningForm extends Component {
    submit = values => {
        this.props.onSubmit(values)
      }
  render() {
    const {
      intl,
      settings: { submitDisabled },
    } = this.props;

    return (
      <div className="fortifid-get-govtDocuments-scanned">
        <PageHeading
          title={<FormattedMessage id="forms.GovtDocumentScanningForm.title" />}
        />
        <Form
          onSubmit={this.submit}
          render={({ handleSubmit, pristine, submitting, form, values }) => (
            <form onSubmit={handleSubmit}>
         
             <FormField
                className="scan-type-selection"
                data={{
                  name: "scanType",
                  options: [
                    {
                      value: "forms.GovtDocumentScanningForm.scanType.camera",
                      icon: CameraIcon,
                    },
                    {
                      value: "forms.GovtDocumentScanningForm.scanType.keypad",
                      icon: KeypadIcon,
                    },
                  ],
                  required: true,
                  type: FIELD_TYPES.radioimage,
                }}
              />
            <FormActionsWrapper>
                <TertiaryButton className="govt-doc-btn" size="medium" onClick={this.props.onPrev}>
                  <Icon name="Previous" className="fortifid-icon__previous" />
                  <FormattedMessage id="prevButton" defaultMessage="Previous" />
                </TertiaryButton>
                {this.props.individualData.employmentStatus !== undefined && (
                  <TertiaryButton className="govt-doc-btn" size="medium" onClick={this.props.onReview}>
                    <FormattedMessage id="backButton" defaultMessage="Back to review" />
                  </TertiaryButton>
                )}
                <PrimaryButton className="cta-button govt-doc-btn" disabled={submitting || submitDisabled} type="submit" size="medium">
                  <FormattedMessage id="nextButton" defaultMessage="Submit" />
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
}))(injectIntl(GovtDocScanningForm))
