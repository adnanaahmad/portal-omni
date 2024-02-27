import React from "react"
import classnames from "classnames"

import CheckMark from "static/images/icons/checkmark.inline.svg"
import CheckMarkFilled from "static/images/icons/checkmark-filled.inline.svg"
import ChevronLeft from "static/images/icons/chevron-left.inline.svg"
import EllipseFilled from "static/images/icons/ellipse-filled.inline.svg"
import Error from "static/images/icons/error.inline.svg"
import Help from "static/images/icons/help.inline.svg"
import Info from "static/images/icons/info.inline.svg"
import Previous from "static/images/icons/previous.inline.svg"
import Next from "static/images/icons/next.inline.svg"
import Restart from "static/images/icons/restart.inline.svg"
import Warning from "static/images/icons/warning.inline.svg"

import "./Icon.scss"

const Icons = {
  CheckMark,
  CheckMarkFilled,
  ChevronLeft,
  EllipseFilled,
  Error,
  Help,
  Info,
  Previous,
  Next,
  Restart,
  Warning,
}

const Icon = ({ name, className }) => {
  const I = Icons[name]
  return (
    <div className={classnames("fortifid-icon", className)}>
      <I />
    </div>
  )
}

export default Icon
