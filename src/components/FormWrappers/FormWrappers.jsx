import React from "react"

import "./FormWrappers.scss"

export const FormFieldsWrapper = ({ children }) => (
  <div className="row no-gutters justify-content-center">
    <div className="col-16 col-lg-7 col-xl-5">
      <div className="fortifid-form-fields">{children}</div>
    </div>
  </div>
)

export const FormActionsWrapper = ({ children }) => (
  <div className="row no-gutters justify-content-center">
    <div className="col-16 col-lg-8">
      <div className="fortifid-form-actions">{children}</div>
    </div>
  </div>
)
