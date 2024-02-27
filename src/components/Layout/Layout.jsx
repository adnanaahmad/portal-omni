import React, { Component } from "react"
import { connect } from "react-redux"
import Header from "components/Header/Header"
import Footer from "components/Footer/Footer"
import LoadingAnimation from "components/LoadingAnimation/LoadingAnimation"

import "./Layout.scss"

class Layout extends Component {
  render() {
    const { settings, children, disableStartOver } = this.props
    return (
      <React.Fragment>
        {(settings.logoURL && (
          <div className="fortifid-content">
            <Header disableStartOver={settings.disableStartOver || disableStartOver} />
            <main className="fortifid-content-box">{children}</main>
            <Footer />
          </div>
        )) || (
          <div className="fortifid-loading">
            <LoadingAnimation />
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default connect(state => ({ settings: state.settings }))(Layout)
