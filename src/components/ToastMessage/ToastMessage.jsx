import React from "react"
import { FormattedMessage } from "react-intl"
import Icon from "components/Shared/Icon/Icon"
import "./ToastMessage.scss"

const iconNameMap = {
  default: "Info",
  error: "Error",
  success: "CheckMark",
  info: "Info",
  warning: "Warning",
}

const ToastMessage = ({ toastProps, closeToast, ...rest }) => <IconMessage type={toastProps.type} {...rest} />

const IconMessage = ({ type, ...rest }) => (
  <div className="fortifid-toast-message">
    <div className="fortifid-toast-message__icon-container">
      <Icon name={iconNameMap[type]} className={`fortifid-toast-icon ${type}`} />
    </div>
    <div className="fortifid-toast-message__message-container">
      <FormattedMessage {...rest} />
    </div>
  </div>
)

export default ToastMessage
