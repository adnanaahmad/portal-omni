import React, { Component } from "react"
import { withPrefix } from "gatsby"
import { Helmet } from "react-helmet"
import { connect } from "react-redux"
import { IntlProvider } from "react-intl"
import { ToastContainer } from "react-toastify"
import { actionAppLoaded } from "components/state/actions"
import "./Root.scss"

import LocaleEN from "i18n/en.json"
import LocaleES from "i18n/es.json"

const defaultLocale = "en"

const globalMessages = {
  en: flattenMessages(LocaleEN),
  es: flattenMessages(LocaleES),
}

function flattenMessages(nestedMessages, prefix = "") {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    let value = nestedMessages[key]
    let prefixedKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === "string") {
      messages[prefixedKey] = value
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey))
    }

    return messages
  }, {})
}

class Root extends Component {
  async componentDidMount() {
    this.props.dispatch(actionAppLoaded())
  }

  render() {
    const { localeData } = this.props
    return (
      <IntlProvider
        key={localeData.locale}
        locale={localeData.locale}
        defaultLocale={defaultLocale}
        messages={globalMessages[localeData.locale]}
      >
        <Helmet
          script={[
            {
              type: "text/javascript",
              src: withPrefix("/env.js"),
            },
          ]}
        />
        {this.props.children}
        <ToastContainer position="top-right" autoClose={5000} />
      </IntlProvider>
    )
  }
}

export default connect(state => ({ localeData: state.localeData }))(Root)
