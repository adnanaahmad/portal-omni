import React, { Component } from "react"
import { TertiaryButton } from "components/Shared/Button/Button"
import { FormattedMessage } from "react-intl"

class ReviewButton extends Component {
    render() {
        const {
            backToReview
          } = this.props
          
        return (
            localStorage.getItem("nextBtnHitEmployementInfoForm") && (
                <TertiaryButton size="medium" onClick={backToReview}>
                    <FormattedMessage id="backButton" defaultMessage="Back to review" />
                </TertiaryButton>
            )
        )
    };
}
export default ReviewButton