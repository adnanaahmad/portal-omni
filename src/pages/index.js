import React from "react"
import Layout from "components/Layout/Layout"
import Seo from "../components/Seo"
import FlowControlContainer from "components/FlowControlContainer/FlowControlContainer"

const IndexPage = ({ location }) => (
  <Layout>
    <Seo title="Get Started" />
    <FlowControlContainer location={location} />
  </Layout>
)
export default IndexPage
