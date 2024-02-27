import React from "react"
import { FormattedMessage, injectIntl } from "react-intl"
import Layout from "components/Layout/Layout"
import Seo from "../components/Seo"
import ContentBox from "components/Shared/ContentBox/ContentBox"
import PageHeading from "components/PageHeading/PageHeading"

const NotFoundPage = () => (
  <Layout disableStartOver>
    <Seo title="404: Not found" />
    <ContentBox>
      <PageHeading title={<FormattedMessage id="404Page.title" />} subtitle={<FormattedMessage id="404Page.subtitle" />} />
    </ContentBox>
  </Layout>
)

export default injectIntl(NotFoundPage)
