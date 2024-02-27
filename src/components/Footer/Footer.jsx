import React from "react"

import Link from "components/Shared/Link/Link"

import Logo1 from "static/images/logo/part1.svg"
import Logo2 from "static/images/logo/part2.svg"
import "./Footer.scss"

export default () => (
  <footer className="fortifid-footer">
    <div className="fortifid-footer__content">
      <span className="fortifid-footer__text">Powered by</span>
      <Link className="fortifid-footer__link" href="https://fortifid.com">
        <img alt="" className="fortifid-footer__logo1" src={Logo1} />
        <img alt="" className="fortifid-footer__logo2" src={Logo2} />
      </Link>
    </div>
  </footer>
)
