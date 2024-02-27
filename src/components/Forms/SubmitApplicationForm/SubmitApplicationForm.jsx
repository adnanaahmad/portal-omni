import React, { Component } from "react"
import { connect } from "react-redux"
import { FormattedMessage, injectIntl } from "react-intl"
import PageHeading from "components/PageHeading/PageHeading"
// import "./GetStartedForm.scss"
// import "../ExistingCustomerForm/ExistingCustomerForm.scss"
import "../SubmitApplicationForm/SubmitApplicationForm.scss"
import ApplicatonProcess from "static/images/icons/applicatonProcess.svg"
import { toast } from "react-toastify"
import ToastMessage from "components/ToastMessage/ToastMessage"
import { navigate } from "gatsby"
class SubmitApplicationForm extends Component {
  submit = values => {
    // this.props.onSubmit(values)
  }


  componentDidMount() {
    toast.warning(<ToastMessage id="globalMessages.submitApplicationWarning" />)
    setTimeout(() => {
      navigate("/applicationstatus")
    }, 5000);
  }

  render() {
    const {
      intl,
      settings: { submitDisabled },
    } = this.props
    return (
      <div className="fortifid-submit-application-loading">
        <div className="loading-area">
          <div class="loader">
            <img id="applicationProcess" src={ApplicatonProcess} />
          </div>
        </div>
        <PageHeading
          title={<FormattedMessage id="forms.SubmitApplicationForm.title" />}
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
}))(injectIntl(SubmitApplicationForm))


