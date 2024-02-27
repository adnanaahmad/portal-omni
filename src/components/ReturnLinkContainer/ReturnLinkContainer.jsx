import React, { Component } from "react"
import { connect } from "react-redux"
import { injectIntl } from "react-intl"
import { actionVerifyReturnLink } from "components/state/actions"
import ContentBox from "components/Shared/ContentBox/ContentBox"
import ReturnLinkForm from "components/Forms/ReturnLinkForm/ReturnLinkForm"

class ReturnLinkContainer extends Component {
  componentDidMount() {}

  onSubmit = values => {
    const { dispatch, location } = this.props
    const { app_id } = new URLSearchParams(location.search)
    dispatch(actionVerifyReturnLink({ applicationId: app_id, ...values }))
  }

  render() {
    return (
      <div className="fortifid-idv">
        <ContentBox>
          <ReturnLinkForm onSubmit={this.onSubmit} />
        </ContentBox>
      </div>
    )
  }
}

export default connect(state => ({
  applicationStatus: state.applicationStatus,
}))(injectIntl(ReturnLinkContainer))
