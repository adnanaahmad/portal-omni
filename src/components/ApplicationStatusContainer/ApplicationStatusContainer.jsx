import React, { Component } from "react"
import { connect } from "react-redux"
import { navigate } from "gatsby-link"
import {
  actionLoadApplicationStatus,
  actionConsumerInsightsRequest,
  actionBusinessInsightsRequest,
  actionMFARequest,
  actionMFAVerify,
  actionDocumentRequest,
  actionDocumentVerify,
  actionIncomeEmailRequest,
  actionIncomeSMSRequest,
  actionIncomeVerify,
  actionIncomeInsightsRequest,
  actionApplicationStatusChange,
  actionSendRestoreEmail,
  actionSendCompleteEmail,
} from "components/state/actions"
import { FormattedMessage, injectIntl } from "react-intl"
import { RegularLink } from "components/Shared/Link/Link"
import ProgressBar from "components/ProgressBar/ProgressBar"
import ContentBox from "components/Shared/ContentBox/ContentBox"
import PageHeading from "components/PageHeading/PageHeading"
import Icon from "components/Shared/Icon/Icon"
import { PrimaryButton, SecondaryButton } from "components/Shared/Button/Button"
import ApplicationStatuses from "constants/applicationstates"
import FinancialAccountTypes from "data/FinancialAccountTypes"
import Spinner from "components/Spinner/Spinner"

import "./ApplicationStatusContainer.scss"
import { toast } from "react-toastify"
import ToastMessage from "components/ToastMessage/ToastMessage"
import { actionTempMFAVerify } from "../state/actions"
import MobilePhoneEdit from "components/Popups/MobilePhoneEdit/MobilePhoneEdit"


const POLL_INTERVAL = 10000
const POLL_INTERVALVERIFY = 10000

const MessageBox = ({ type, children }) => <div className={`fortifid-message-box ${type}`}>{children}</div>

class ApplicationStatusContainer extends Component {
  timer = null
  retry = false
  partNumber = 2

  updatePartNumber(status) {
    if ([
      ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST
    ].includes(status)) {
      this.partNumber = 3
    } else if ([
      ApplicationStatuses.INCOME_BANK_VERIFICATION_REQUEST
    ].includes(status)) {
      this.partNumber = 4
    }
  }

  componentDidMount() {
    const { applicationData } = this.props
    if (applicationData.applicationId) {
      this.props.dispatch(actionLoadApplicationStatus())
    } else {
      navigate("/404")
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  componentDidUpdate(prevProps) {
    const { applicationStatus, dispatch } = this.props
    if (applicationStatus.status !== prevProps.applicationStatus.status) {
      if (this.timer) {
        clearInterval(this.timer)
      }

      this.updatePartNumber(applicationStatus.status)

      if (applicationStatus.status === ApplicationStatuses.DATA_COLLECTION) {
        return navigate("/")
      } else if (applicationStatus.status === ApplicationStatuses.CONSUMER_INSIGHTS) {
        dispatch(actionConsumerInsightsRequest())
        toast.warning(<ToastMessage id="applicationStatusPage.steps.consumerInsights.notification" />, {
          toastId: "status",
          autoClose: false,
        })
      } else if (applicationStatus.status === ApplicationStatuses.BUSINESS_INSIGHTS) {
        dispatch(actionBusinessInsightsRequest())
      } else if (applicationStatus.status === ApplicationStatuses.SEND_EMAIL_RESTORE) {
        dispatch(actionSendRestoreEmail())
      } else if (applicationStatus.status === ApplicationStatuses.SECURE_MFA_REQUEST && !this.retry) {
        toast.success(
          <ToastMessage
            id="applicationStatusPage.enterMessage"
            values={{
              b: chunks => <strong>{chunks}</strong>,
            }}
          />,
          {
            toastId: "status",
          }
        )
      } else if (applicationStatus.status === ApplicationStatuses.SECURE_MFA_VERIFY) {
        this.timer = setInterval(() => {
          dispatch(actionTempMFAVerify())
        }, POLL_INTERVAL)
      } else if (applicationStatus.status === ApplicationStatuses.DOCUMENT_VERIFICATION_VERIFY) {
        this.timer = setInterval(() => {
          dispatch(actionDocumentVerify())
        }, POLL_INTERVALVERIFY)
      } else if (applicationStatus.status === ApplicationStatuses.INCOME_BANK_VERIFICATION_VERIFY) {
        this.timer = setInterval(() => {
          dispatch(actionIncomeVerify())
        }, POLL_INTERVAL)
      } else if (applicationStatus.status === ApplicationStatuses.INCOME_INSIGHTS) {
        dispatch(actionIncomeInsightsRequest())
        toast.warning(<ToastMessage id="applicationStatusPage.steps.incomeInsights.notification" />, {
          toastId: "status",
          autoClose: false,
        })
      } else if (applicationStatus.status === ApplicationStatuses.SEND_EMAIL_COMPLETE) {
        dispatch(actionSendCompleteEmail())
      } else if (applicationStatus.status === ApplicationStatuses.DONE) {
        toast.dismiss()
      } else if (applicationStatus.status === ApplicationStatuses.ERROR) {
        toast.dismiss()
      } else if (applicationStatus.status === ApplicationStatuses.EXPIRED) {
        toast.dismiss()
        toast.error(<ToastMessage id="applicationStatusPage.expiredMessage" />, {
          toastId: "status",
          autoClose: false,
        })
      }
    }
  }


  mask = value => {
    const maskStr = "#", maskRegex = /([\d])(?=([\d\s]){1})/g
    return value && value.replace(maskRegex, maskStr)
  }

  render() {
    const { dispatch, applicationStatus, individualData, existingCustomerData, settings, applicationData } = this.props
    this.updatePartNumber(applicationStatus.status)
    if ([ApplicationStatuses.DATA_COLLECTION].includes(applicationStatus.status)) {
      return (
        <div className="fortifid-application-status">
          <ContentBox>
            <div className="fortifid-application-status__wrapper">
              <div className="row no-gutters justify-content-center">
                <div className="col-16 d-flex justify-content-center">
                  <Spinner className="fortifid-application-status__spinner" />
                </div>
              </div>
              <PageHeading title={<FormattedMessage id="applicationStatusPage.title" />} />
            </div>
          </ContentBox>
        </div>
      )
    }

    if (applicationStatus.status === ApplicationStatuses.EXPIRED) {
      return (
        <div className="fortifid-application-status">
          <ContentBox>
            <div className="fortifid-application-status__wrapper">
              <PageHeading
                title={<FormattedMessage id="applicationStatusPage.expiredTitle" />}
                subtitle={
                  <FormattedMessage
                    id="applicationStatusPage.contactUs"
                    values={{
                      a: chunks => <RegularLink to={settings.externalContactPageURL}>{chunks}</RegularLink>,
                    }}
                  />
                }
              />
            </div>
          </ContentBox>
        </div>
      )
    }

    if (
      [ApplicationStatuses.CONSUMER_INSIGHTS, ApplicationStatuses.BUSINESS_INSIGHTS, ApplicationStatuses.SEND_EMAIL_RESTORE].includes(
        applicationStatus.status
      )
    ) {
      return (
        <div className="fortifid-application-status">
          <ContentBox>
            <div className="fortifid-application-status__wrapper">
              <div className="row no-gutters justify-content-center">
                <div className="col-16 d-flex justify-content-center">
                  <Spinner className="fortifid-application-status__spinner" />
                </div>
              </div>
              <PageHeading title={<FormattedMessage id="applicationStatusPage.steps.consumerInsights.title" />} />
            </div>
          </ContentBox>
        </div>
      )
    }

    if (
      [
        ApplicationStatuses.SECURE_MFA_ERROR,
        ApplicationStatuses.DOCUMENT_VERIFICATION_ERROR,
        ApplicationStatuses.INCOME_BANK_VERIFICATION_ERROR,
      ].includes(applicationStatus.status)
    ) {
      return (
        <div className="fortifid-application-status">
          <ContentBox>
            <div className="fortifid-application-status__wrapper">
              <PageHeading
                title={<FormattedMessage id="applicationStatusPage.maxRetriesTitle" />}
                subtitle={
                  <FormattedMessage
                    id="applicationStatusPage.contactUs"
                    values={{
                      a: chunks => <RegularLink to={settings.externalContactPageURL}>{chunks}</RegularLink>,
                    }}
                  />
                }
              />
            </div>
          </ContentBox>
        </div>
      )
    }

    if (applicationStatus.status === ApplicationStatuses.ERROR) {
      return (
        <div className="fortifid-application-status">
          <ContentBox>
            <div className="fortifid-application-status__wrapper">
              <PageHeading
                title={<FormattedMessage id="applicationStatusPage.errorTitle" />}
                subtitle={
                  <FormattedMessage
                    id="applicationStatusPage.errorSubtitle"
                    values={{
                      a: chunks => <RegularLink to={settings.externalContactPageURL}>{chunks}</RegularLink>,
                    }}
                  />
                }
              />
            </div>
          </ContentBox>
        </div>
      )
    }

    if (applicationStatus.status === ApplicationStatuses.DONE) {
      return (
        <div className="fortifid-application-status">
          <ContentBox>
            <div className="row no-gutters justify-content-center">
              <div className="col-xs-16 col-lg-8">
                <ProgressBar display="none" partNumber={5} />
              </div>
            </div>
            <div className="fortifid-application-status__wrapper">
              <div className="row no-gutters justify-content-center">
                <div className="col-16 d-flex justify-content-center">
                  <Icon name="CheckMarkFilled" className="fortifid-application-status__icon success large" />
                </div>
              </div>
              <PageHeading
                title={<FormattedMessage id="applicationStatusPage.completionTitle" />}
                subtitle={
                  <FormattedMessage
                    id="applicationStatusPage.completionSubtitle"
                    values={{
                      p: chunks => <p>{chunks}</p>,
                      a: chunks => <RegularLink to={settings.externalContactPageURL}>{chunks}</RegularLink>,
                    }}
                  />
                }
              />
            </div>
          </ContentBox>
        </div>
      )
    }

    if ([ApplicationStatuses.INCOME_INSIGHTS, ApplicationStatuses.SEND_EMAIL_COMPLETE].includes(applicationStatus.status)) {
      return (
        <div className="fortifid-application-status">
          <ContentBox>
            <div className="fortifid-application-status__wrapper">
              <div className="row no-gutters justify-content-center">
                <div className="col-16 d-flex justify-content-center">
                  <Spinner className="fortifid-application-status__spinner" />
                </div>
              </div>
              <PageHeading title={<FormattedMessage id="applicationStatusPage.steps.incomeInsights.title" />} />
            </div>
          </ContentBox>
        </div>
      )
    }

    return (
      <div className="fortifid-application-status">
        <ContentBox>
          <div className="row no-gutters justify-content-center">
            <div className="col-xs-16 col-lg-8">
              <ProgressBar display="none" partNumber={this.partNumber} />
            </div>
          </div>
          <PageHeading title={<FormattedMessage id="applicationStatusPage.title" />} />

          <div className="row no-gutters justify-content-center">
            <div className="col-xs-16 col-lg-8">
              <div className="fortifid-application-status__steps">
                {[ApplicationStatuses.SECURE_MFA_REQUEST, ApplicationStatuses.SECURE_MFA_VERIFY].includes(applicationStatus.status) && (
                  <MessageBox type="default">

                    <div className="fortifid-application-status__message-content">
                      <div className="fortifid-application-status__step-title">
                        <FormattedMessage id="applicationStatusPage.steps.mfa.title" />
                      </div>

                      <div className="fortifid-application-status__step-text">
                        {
                          (applicationData.flowType !== "Existing Customer") ? <FormattedMessage
                            id="applicationStatusPage.steps.mfa.text"
                            values={{
                              mobilePhone: individualData.mobilePhone,
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                            :
                            <FormattedMessage
                              id="applicationStatusPage.steps.mfa.textexisting"
                              values={{
                                phone: existingCustomerData.personalData?.mobilePhone,
                                b: chunks => <strong>{chunks}</strong>,
                              }}
                            />
                        }

                      </div>

                      <div className="fortifid-application-status__step-actions">
                        {applicationStatus.status === ApplicationStatuses.SECURE_MFA_REQUEST && (
                          <PrimaryButton
                            size="small"
                            className="fortifid-application-status__step-button"
                            disabled={settings.submitDisabled}
                            onClick={() => {
                              dispatch(actionMFARequest())
                            }}
                          >
                            <FormattedMessage id="applicationStatusPage.steps.mfa.buttons.sms" />
                          </PrimaryButton>
                        )}
                        {applicationStatus.status === ApplicationStatuses.SECURE_MFA_VERIFY && (
                          <React.Fragment>
                            <PrimaryButton size="small" className="fortifid-application-status__step-button green">
                              <Icon name="CheckMark" className="fortifid-success-block__icon" />
                            </PrimaryButton>
                            <div className="fortifid-application-status__waiting">
                              <Spinner className="fortifid-application-status__loader" />
                              <div className="fortifid-application-status__waiting-message">
                                <FormattedMessage id="applicationStatusPage.steps.mfa.waitMessage" />
                              </div>
                            </div>
                          </React.Fragment>
                        )}
                      </div>

                      {applicationStatus.status === ApplicationStatuses.SECURE_MFA_VERIFY && (
                        <div className="fortifid-application-status__retry">
                          <FormattedMessage
                            id="applicationStatusPage.steps.mfa.retryMessage"
                            values={{
                              a: chunks => (
                                <RegularLink
                                  onClick={() => {
                                    this.retry = true
                                    dispatch(actionApplicationStatusChange(ApplicationStatuses.SECURE_MFA_REQUEST))
                                  }}
                                >
                                  {chunks}
                                </RegularLink>
                              ),
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {individualData.isDemoMode === true && applicationStatus.status === ApplicationStatuses.SECURE_MFA_REQUEST && (
                      <MobilePhoneEdit />
                    )}
                  </MessageBox>
                )}

                {[
                  ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST,
                  ApplicationStatuses.DOCUMENT_VERIFICATION_VERIFY,
                  ApplicationStatuses.INCOME_BANK_VERIFICATION_REQUEST,
                  ApplicationStatuses.INCOME_BANK_VERIFICATION_VERIFY,
                ].includes(applicationStatus.status) && (
                    <MessageBox type="success">
                      <FormattedMessage id="applicationStatusPage.steps.mfa.success" />
                      <Icon name="CheckMark" className="fortifid-message-box__icon success" />
                    </MessageBox>
                  )}

                {[ApplicationStatuses.SECURE_MFA_REQUEST, ApplicationStatuses.SECURE_MFA_VERIFY].includes(applicationStatus.status) && (
                  <MessageBox type="disabled">
                    <FormattedMessage id="applicationStatusPage.steps.identity.title" />
                  </MessageBox>
                )}

                {[ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST, ApplicationStatuses.DOCUMENT_VERIFICATION_VERIFY].includes(
                  applicationStatus.status
                ) && (
                    <MessageBox type="default">
                      <div className="fortifid-application-status__message-content">
                        <div className="fortifid-application-status__step-title">
                          <FormattedMessage id="applicationStatusPage.steps.identity.title" />
                        </div>

                        <div className="fortifid-application-status__step-text">
                          <FormattedMessage
                            id="applicationStatusPage.steps.identity.text"
                            values={{
                              phone: individualData.mobilePhone,
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                          <br />
                          <br />
                          <FormattedMessage
                            id="applicationStatusPage.steps.identity.photo"
                            values={{
                              b: chunks => <strong>{chunks}</strong>,
                            }} />
                        </div>

                        <div className="fortifid-application-status__step-actions">
                          {applicationStatus.status === ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST && (
                            <PrimaryButton
                              size="small"
                              className="fortifid-application-status__step-button"
                              disabled={settings.submitDisabled}
                              onClick={() => {
                                dispatch(actionDocumentRequest())
                              }}
                            >
                              <FormattedMessage id="applicationStatusPage.steps.identity.buttons.sms" />
                            </PrimaryButton>
                          )}

                          {applicationStatus.status === ApplicationStatuses.DOCUMENT_VERIFICATION_VERIFY && (
                            <React.Fragment>
                              <PrimaryButton size="small" className="fortifid-application-status__step-button green">
                                <Icon name="CheckMark" className="fortifid-success-block__icon" />
                              </PrimaryButton>
                              <div className="fortifid-application-status__waiting">
                                <Spinner className="fortifid-application-status__loader" />
                                <div className="fortifid-application-status__waiting-message">
                                  <FormattedMessage id="applicationStatusPage.steps.identity.waitMessage" />
                                </div>
                              </div>
                            </React.Fragment>
                          )}
                        </div>

                        {applicationStatus.status === ApplicationStatuses.DOCUMENT_VERIFICATION_VERIFY && (
                          <div className="fortifid-application-status__retry">
                            <FormattedMessage
                              id="applicationStatusPage.steps.identity.retryMessage"
                              values={{
                                a: chunks => (
                                  <RegularLink
                                    onClick={() => dispatch(actionApplicationStatusChange(ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST))}
                                  >
                                    {chunks}
                                  </RegularLink>
                                ),
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </MessageBox>
                  )}

                {[ApplicationStatuses.INCOME_BANK_VERIFICATION_REQUEST, ApplicationStatuses.INCOME_BANK_VERIFICATION_VERIFY].includes(
                  applicationStatus.status
                ) && (
                    <MessageBox type="success">
                      <FormattedMessage id="applicationStatusPage.steps.identity.success" />
                      <Icon name="CheckMark" className="fortifid-message-box__icon success" />
                    </MessageBox>
                  )}

                {[
                  ApplicationStatuses.SECURE_MFA_REQUEST,
                  ApplicationStatuses.SECURE_MFA_VERIFY,
                  ApplicationStatuses.DOCUMENT_VERIFICATION_REQUEST,
                  ApplicationStatuses.DOCUMENT_VERIFICATION_VERIFY,
                ].includes(applicationStatus.status) &&
                  individualData.financialAccountType !== FinancialAccountTypes.none && (
                    <MessageBox type="disabled">
                      <FormattedMessage id="applicationStatusPage.steps.income.title" />
                    </MessageBox>
                  )}

                {[ApplicationStatuses.INCOME_BANK_VERIFICATION_REQUEST, ApplicationStatuses.INCOME_BANK_VERIFICATION_VERIFY].includes(
                  applicationStatus.status
                ) && (
                    <MessageBox type="default">
                      <div className="fortifid-application-status__message-content">
                        <div className="fortifid-application-status__step-title">
                          <FormattedMessage id="applicationStatusPage.steps.income.title" />
                        </div>

                        <div className="fortifid-application-status__step-text">
                          <FormattedMessage
                            id="applicationStatusPage.steps.income.text"
                            values={{
                              phone: individualData.mobilePhone,
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                        </div>

                        <div className="fortifid-application-status__step-actions">
                          {applicationStatus.status === ApplicationStatuses.INCOME_BANK_VERIFICATION_REQUEST && (
                            <React.Fragment>
                              <PrimaryButton
                                size="small"
                                className="fortifid-application-status__step-button"
                                disabled={settings.submitDisabled}
                                onClick={() => {
                                  dispatch(actionIncomeSMSRequest())
                                }}
                              >
                                <FormattedMessage id="applicationStatusPage.steps.income.buttons.sms" />
                              </PrimaryButton>

                              <SecondaryButton
                                size="small"
                                className="fortifid-application-status__step-button"
                                disabled={settings.submitDisabled}
                                onClick={() => {
                                  dispatch(actionIncomeEmailRequest())
                                }}
                              >
                                <FormattedMessage id="applicationStatusPage.steps.income.buttons.email" />
                              </SecondaryButton>
                            </React.Fragment>
                          )}
                          {applicationStatus.status === ApplicationStatuses.INCOME_BANK_VERIFICATION_VERIFY && (
                            <React.Fragment>
                              <PrimaryButton size="small" className="fortifid-application-status__step-button green">
                                <Icon name="CheckMark" className="fortifid-success-block__icon" />
                              </PrimaryButton>
                              <div className="fortifid-application-status__waiting">
                                <Spinner className="fortifid-application-status__loader" />
                                <div className="fortifid-application-status__waiting-message">
                                  <FormattedMessage id="applicationStatusPage.steps.income.waitMessage" />
                                </div>
                              </div>
                            </React.Fragment>
                          )}
                        </div>

                        {applicationStatus.status === ApplicationStatuses.INCOME_BANK_VERIFICATION_VERIFY && (
                          <div className="fortifid-application-status__retry">
                            <FormattedMessage
                              id="applicationStatusPage.steps.identity.retryMessage"
                              values={{
                                a: chunks => (
                                  <RegularLink
                                    onClick={() =>
                                      dispatch(actionApplicationStatusChange(ApplicationStatuses.INCOME_BANK_VERIFICATION_REQUEST))
                                    }
                                  >
                                    {chunks}
                                  </RegularLink>
                                ),
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </MessageBox>
                  )}
              </div>
            </div>
          </div>

          <div className="row no-gutters justify-content-center">
            <div className="col-xs-16 col-lg-8">
              <div className="fortifid-application-status__contact-us">
                <FormattedMessage
                  id="applicationStatusPage.contactUs"
                  values={{
                    a: chunks => <RegularLink to={settings.externalContactPageURL}>{chunks}</RegularLink>,
                  }}
                />
              </div>
            </div>
          </div>
        </ContentBox>
      </div>
    )
  }
}

export default connect(state => ({
  applicationData: state.applicationData,
  individualData: state.individualData,
  businessData: state.businessData,
  settings: state.settings,
  applicationStatus: state.applicationStatus,
  existingCustomerData: state.existingCustomerData
}))(injectIntl(ApplicationStatusContainer))
