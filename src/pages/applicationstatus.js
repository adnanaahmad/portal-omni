import React from "react"
import Layout from "components/Layout/Layout"
import Seo from "../components/Seo"
import ApplicationStatusContainer from "components/ApplicationStatusContainer/ApplicationStatusContainer"

const ApplicationStatusPage = ({ location }) => (
  <Layout disableStartOver>
    <Seo title="Application Status Page" />
    <ApplicationStatusContainer location={location} />
  </Layout>
)
export default ApplicationStatusPage
