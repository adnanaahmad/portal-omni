import React from "react"
import "./PageHeading.scss"

const PageHeading = ({ title, subtitle }) => (
  <div className="row no-gutters justify-content-center">
    <div className="col-16 col-lg-10">
      <div className="fortifid-heading">
        <h1 className="fortifid-heading__title">{title}</h1>
        {subtitle && <div className="fortifid-heading__subtitle">{subtitle}</div>}
      </div>
    </div>
  </div>
)

export default PageHeading
