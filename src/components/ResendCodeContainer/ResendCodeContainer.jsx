import React, { Component } from "react"
import { connect } from "react-redux"
import { injectIntl } from "react-intl"
import { actionSendRestoreEmail } from "components/state/actions"
import ContentBox from "components/Shared/ContentBox/ContentBox"
import ResendCodeForm from "components/Forms/ResendCodeForm/ResendCodeForm"

class ResendCodeContainer extends Component {
  componentDidMount() {}

  onSubmit = values => {
    const { dispatch, location } = this.props
    const { app_id } = new URLSearchParams(location.search)
    let body = {"email":values.emailAddress}
    dispatch(actionSendRestoreEmail(body))
  }

  render() {
    return (
      <div className="fortifid-idv">
        <ContentBox>
          <ResendCodeForm onSubmit={this.onSubmit} />
        </ContentBox>
      </div>
    )
  }
}

export default connect(state => ({
  applicationStatus: state.applicationStatus,
}))(injectIntl(ResendCodeContainer))
