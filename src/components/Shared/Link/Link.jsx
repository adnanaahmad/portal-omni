import React from "react"
import { Link as GatsbyLink } from "gatsby"

import "./Link.scss"

const Link = ({ target, to, children, ...rest }) => {
  const internal = !target && /^\/(?!\/)/.test(to)

  // Use Gatsby Link for internal links, and <a> for others
  if (internal) {
    return (
      <GatsbyLink {...rest} to={to}>
        {children}
      </GatsbyLink>
    )
  }

  const _target = target || "_blank"
  return (
    <a href={to} target={_target} rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  )
}

export default Link

export const RegularLink = ({ ...props }) => <Link className="fortifid-link-regular" {...props} />

export const NavigationLink = ({ ...props }) => <Link className="fortifid-link-navigation" {...props} />
