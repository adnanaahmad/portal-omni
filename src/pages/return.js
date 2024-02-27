import React from "react"
import Layout from "components/Layout/Layout"
import Seo from "../components/Seo"
import ReturnLinkContainer from "components/ReturnLinkContainer/ReturnLinkContainer"

const ReturnPage = ({ location }) => (
  <Layout>
    <Seo title="Finish your application" />
    <ReturnLinkContainer location={location} />
  </Layout>
)
export default ReturnPage
