import React, { Component } from "react"
import { FormattedMessage } from "react-intl"
import PropTypes from "prop-types"
import Icon from "components/Shared/Icon/Icon"

import "./ProgressBar.scss"

class ProgressBar extends Component {
  render() {
    const { percent, display, partNumber } = this.props
    return (
      <div>
        <div className="fortifid-progress-step">
          <Icon name={partNumber > 1 ? "CheckMarkFilled" : "EllipseFilled"} className={partNumber > 1 ? "fortifid-progress-step__icon-complete" : "fortifid-progress-step__icon"}/>
          <FormattedMessage id="progressbar.partOne" defaultMessage="Part 1:"/>
          <br />
          <FormattedMessage id="progressbar.application" defaultMessage="Application Form" />
          <Icon name={partNumber > 2 ? "CheckMarkFilled" : "EllipseFilled"} className={partNumber > 2 ? "fortifid-progress-step__icon-complete" : "fortifid-progress-step__icon"}/>
          <div className="fortifid-process-text"  style={{ color: `${partNumber > 2 ? "#142d53" : "#7398a8"}` }}>
            <FormattedMessage id="progressbar.partTwo" defaultMessage="Part 2:"/>
            <br />
            <FormattedMessage id="progressbar.phoneVerifcation" defaultMessage="Phone Verification" />
          </div>
          <Icon name={partNumber > 3 ? "CheckMarkFilled" : "EllipseFilled"} className={partNumber > 3 ? "fortifid-progress-step__icon-complete" : "fortifid-progress-step__icon"}/>
          <div className="fortifid-process-text"  style={{ color: `${partNumber > 3 ? "#142d53" : "#7398a8"}` }}>
            <FormattedMessage id="progressbar.partThree" defaultMessage="Part 3:"/>
            <br />
            <FormattedMessage id="progressbar.proofOfIdentity" defaultMessage="Proof of Identity" />
          </div>
          <Icon name={partNumber > 4 ? "CheckMarkFilled" : "EllipseFilled"} className={partNumber > 4 ? "fortifid-progress-step__icon-complete" : "fortifid-progress-step__icon"}/>
          <div className="fortifid-process-text"  style={{ color: `${partNumber  > 4 ? "#142d53" : "#7398a8"}` }}>
            <FormattedMessage id="progressbar.partFour" defaultMessage="Part 4:" />
            <br />
            <FormattedMessage id="progressbar.proofOfIncome" defaultMessage="Proof of Income" />
          </div>
        </div>
        <div className="fortifid-progressbar" style={{ display: `${display}` }}>
          <div className="fortifid-progressbar__progress" style={{ width: `${percent}%` }} />
        </div>
      </div>
    )
  }
}

ProgressBar.propTypes = {
  currentStep: PropTypes.number,
  percentCompleted: PropTypes.number,
  stepsCount: PropTypes.number,
}

export default ProgressBar
