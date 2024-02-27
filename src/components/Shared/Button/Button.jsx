import React from "react"
import PropTypes from "prop-types"
import classnames from "classnames"

import "./Button.scss"

const Button = ({ className, size, ...rest }) => (
  <button
    {...rest}
    className={classnames(className, {
      "fortifid-button-large": size === "large",
      "fortifid-button-medium": size === "medium",
      "fortifid-button-small": size === "small",
    })}
  />
)

Button.propTypes = {
  size: PropTypes.string,
}

Button.defaultProps = {
  size: "medium",
  type: "button",
}

export const PrimaryButton = ({ className, ...props }) => <Button className={classnames("fortifid-button-primary", className)} {...props} />

export const SecondaryButton = ({ className, ...props }) => (
  <Button className={classnames("fortifid-button-secondary", className)} {...props} />
)

export const TertiaryButton = ({ className, ...props }) => (
  <Button className={classnames("fortifid-button-tertiary", className)} {...props} />
)

export const DestructivePrimaryButton = ({ className, ...props }) => (
  <Button className={classnames("fortifid-button-destructive-primary", className)} {...props} />
)

export const DestructiveSecondaryButton = ({ className, ...props }) => (
  <Button className={classnames("fortifid-button-destructive-secondary", className)} {...props} />
)

export const TextButton = ({ className, ...props }) => <Button className={classnames("fortifid-button-text", className)} {...props} />
