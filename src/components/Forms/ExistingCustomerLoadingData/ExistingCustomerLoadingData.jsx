import React, { Component } from "react"
import { connect } from "react-redux"
import { FormattedMessage, injectIntl } from "react-intl"
import PageHeading from "components/PageHeading/PageHeading"
import CustomerLoadingAnmiation from "components/LoadingAnimation/ExistingCustomerLoadingAnimation"
import "./ExistingCustomerLoadingData.scss"


class ExistingCustomerLoadingData extends Component {

  state = {
    progress:"50"
  };
    
  submit = async values => {
    this.props.onSubmit(values)
  }

  componentDidMount() {
   this.submissionTimer = setTimeout(() => {
     this.submit();
   }, 3000);
  }
  componentWillUnmount() {
    if (this.submissionTimer) {
      clearInterval(this.submissionTimer);
      this.submissionTimer = null;
    }
  }
  render() {
    const loaderColor= "#0376BCCC";
    const {
      intl,
      individualData: {
       
      },
      settings: { submitDisabled },
    } = this.props;

    return (
      <div className="fortifid-existingCustomerLoading-data-form">
          <PageHeading title={<FormattedMessage id="forms.ExistingCustomerLoadingDataForm.title" />} 
            subtitle={<FormattedMessage id="forms.ExistingCustomerLoadingDataForm.subtitle" />}
          />

        <div className="existing-formLoadingData">
            <h3 className="loading-data-text">Loading...</h3>
            <CustomerLoadingAnmiation  bgcolor={loaderColor} progress={this.state.progress}  height={48}/>
        </div>
       
      </div>
    )
  }
}
export default connect(state => ({
  applicationData: state.applicationData,
  individualData: state.individualData,
  businessData: state.businessData,
  settings: state.settings,
}))(injectIntl(ExistingCustomerLoadingData))
