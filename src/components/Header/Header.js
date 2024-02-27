import React from "react"
import { connect } from "react-redux"
import { FormattedMessage } from "react-intl"
import Popup from "reactjs-popup"
import ContentBox from "components/Shared/ContentBox/ContentBox"

import { actionFlowRestart } from "components/state/actions"
import { DestructivePrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import { NavigationLink } from "components/Shared/Link/Link"
import Icon from "components/Shared/Icon/Icon"

import "./Header.scss"
import { clearLocalStorage } from "../Shared/helpers"
import { actionSettingsChange } from "../state/actions"

const TriggerLink = React.forwardRef((props, ref) => <NavigationLink {...props} />)

const Header = ({ settings, dispatch, disableStartOver }) => (
  <header className="fortifid-header">
    <ContentBox>
      <div className="fortifid-header__content">
        <div className="fortifid-header__nav-left"/>
        <div className="fortifid-header__logo-container">
          <div className="fortifid-header__logo">
            <img alt="" src={settings.brandLogo || settings.logoURL} />
          </div>
        </div>
        <div className="fortifid-header__nav-right">
          <div data-toggle="tooltip" data-placement="bottom" title="Contact Us">
            <NavigationLink to={settings.externalContactPageURL}>
              <Icon name="Help" />
            </NavigationLink>
          </div>
          {!disableStartOver && (
            <Popup
              className="fortifid-start-over-popup"
              trigger={
                <div data-toggle="tooltip" data-placement="bottom" title="Start Again">
                  <TriggerLink>
                    <Icon name="Restart" />
                    <span className="fortifid-header__nav-link-text">
                      <FormattedMessage id="header.links.restart" defaultMessage="Restart" />
                    </span>
                  </TriggerLink>
                </div>
              }
              modal
              nested
            >
              {close => (
                <div className="fortifid-start-over-popup__container">
                  <div className="fortifid-start-over-popup__header">
                    <h3 className="fortifid-start-over-popup__title">
                      <FormattedMessage id="popups.startOver.title" />
                    </h3>
                    <div className="fortifid-start-over-popup__description">
                      <FormattedMessage id="popups.startOver.description" />
                    </div>
                  </div>
                  <div className="fortifid-start-over-popup__actions">
                    <DestructivePrimaryButton
                      onClick={() => {
                        clearLocalStorage();
                        dispatch(actionSettingsChange({ editForm: false }));
                        dispatch(actionFlowRestart())
                        close()
                      }}
                      size="medium"
                    >
                      <FormattedMessage id="popups.startOver.startButton" defaultMessage="Start Over" />
                    </DestructivePrimaryButton>
                    <TertiaryButton onClick={close} size="medium">
                      <FormattedMessage id="popups.startOver.cancelButton" defaultMessage="Cancel" />
                    </TertiaryButton>
                  </div>
                </div>
              )}
            </Popup>
          )}
        </div>
      </div>
    </ContentBox>
  </header>
)

export default connect(state => ({
  settings: state.settings,
}))(Header)
