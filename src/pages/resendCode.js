import React from "react"
import Layout from "components/Layout/Layout"
import Seo from "../components/Seo"
import ResendCodeContainer from "components/ResendCodeContainer/ResendCodeContainer"

const ResendPage = ({ location }) => (
  <Layout>
    <Seo title="Resend Verification Code" />
    <ResendCodeContainer location={location} />
  </Layout>
)
export default ResendPage
