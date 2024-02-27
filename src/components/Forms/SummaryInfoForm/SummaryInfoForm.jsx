import React, { Component } from "react"
import { connect } from "react-redux"
import { Form } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import Icon from "components/Shared/Icon/Icon"
import PageHeading from "components/PageHeading/PageHeading"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import { FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import EmploymentStatuses from "data/EmploymentStatuses.json"
import { NavigationLink } from "components/Shared/Link/Link"
import FinancialAccountTypes from "data/FinancialAccountTypes.json"
import FinancialCashAdvanceStatus from "data/FinancialCashAdvanceStatus.json"
import LOAN_TYPES from "data/LoanTypes"
import moment from "moment"
import getYearsRange from "../../../constants/yearsRange"
import "./SummaryInfoForm.scss"
import beautifyPhoneNumber from "../../../constants/beautifyPhoneNumber"
import { actionSettingsChange } from "../../state/actions"
import { FORMER_ADDRESS_THRESHOLD } from "../../../constants/common"

class SummaryInfoForm extends Component {
  constructor() {
    super();
    this.state = { ssn: true, fid: true }
  }
  submit = values => {
    const { applicationData } = this.props;
    this.props.onSubmit(values)
  }

  mask = value => {
    const maskStr = "*", maskRegex = /([\d])(?=([\d\s]){0})/g
    return value && value.replace(maskRegex, maskStr)
  }

  currency = value => {
    const { intl } = this.props
    return Intl.NumberFormat(intl.locale, { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value)
  }

  componentDidMount() {
    this.props.dispatch(actionSettingsChange({ editForm: false }));
  }

  render() {
    const {
      applicationData,
      businessData,
      individualData,
      isLastForm,
      settings: { submitDisabled }
    } = this.props

    return (
      <div className="fortifid-summary-form">
        <PageHeading title={<FormattedMessage id="forms.SummaryInfoForm.title" />} />
        <Form
          onSubmit={this.submit}

          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              {/* {applicationData.flowType !== LOAN_TYPES.credit_card && (
                <div className="row no-gutters justify-content-center">
                  <div className="col-16 col-lg-8">
                    <FormattedMessage className="fortifid-form-fields"
                      id="forms.SummaryInfoForm.fields.loan.label"
                      defaultMessage="Loan Information"
                    />
                    {/* {!applicationData.coApplicant && (
                      <NavigationLink to="/#loanDetailsForm">
                        <FormattedMessage id="forms.SummaryInfoForm.fields.edit.label" defaultMessage="Edit" />
                      </NavigationLink>
                    )} */}
              {/* </div> */}
              {/* </div> */}
              {/* )} */}
              {applicationData.flowType === LOAN_TYPES.small_business && (
                <div className="row no-gutters justify-content-center">
                  <div className="col-16 col-lg-8 d-flex justify-content-between" id="form-section-heading">
                    <FormattedMessage className="fortifid-form-fields"
                      id="forms.SummaryInfoForm.fields.smallBusiness.label"
                      defaultMessage="Business Information"
                    />
                    {
                      !individualData.coApplicantReturnFlow &&
                      <NavigationLink onClick={() => this.props.dispatch(actionSettingsChange({ editForm: true }))} className="fortifid-link-navigation edit-link" to="/#businessInfoForm">
                        <FormattedMessage id="forms.SummaryInfoForm.fields.edit.label" defaultMessage="Edit" />
                      </NavigationLink>
                    }
                  </div>
                </div>
              )}
              {applicationData.flowType === LOAN_TYPES.small_business && (
                <FormActionsWrapper>
                  <table className="business-info">
                    <tbody>
                      <tr>
                        <td>
                          <FormattedMessage
                            id="forms.SummaryInfoForm.fields.smallBusiness.businessType.label"
                            values={{
                              businessType: businessData.businessType,
                              typeOfOwnership: businessData.typeOfOwnership,
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormattedMessage
                            id="forms.SummaryInfoForm.fields.smallBusiness.typeOfOwnership.label"
                            values={{
                              typeOfOwnership: businessData.typeOfOwnership,
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormattedMessage
                            id="forms.SummaryInfoForm.fields.smallBusiness.companyName.label"
                            values={{
                              companyName: businessData.companyName,
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormattedMessage
                            id="forms.SummaryInfoForm.fields.smallBusiness.doingBusinessAs.label"
                            values={{
                              doingBusinessAs: businessData.doingBusinessAs,
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormattedMessage
                            id="forms.SummaryInfoForm.fields.smallBusiness.phoneNumber.label"
                            values={{
                              phone: beautifyPhoneNumber(businessData.phoneNumber),
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormattedMessage
                            id="forms.SummaryInfoForm.fields.smallBusiness.webSite.label"
                            values={{
                              webSite: businessData.webSite,
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                        </td>
                      </tr>
                      {
                        businessData.federalIdNumber &&
                        <tr>
                          <td>
                            <FormattedMessage
                                id="forms.SummaryInfoForm.fields.smallBusiness.federalIdNumber.label"
                                values={{
                                  federalIdNumber: <span className="federal-number">
                                    { this.state.fid ? this.mask(businessData.federalIdNumber) : businessData.federalIdNumber}
                                      <button type="button" onClick={() => this.setState({ fid: !this.state.fid })} className="FederalIdNumberButton">
                                        {this.state.fid ? 'Show' : 'Hide'}
                                      </button>
                                    </span>,
                                    b: chunks => <strong>{chunks}</strong>,
                                  }}
                                />
                          </td>
                        </tr>
                      }
                      <tr>
                        <td>
                          <FormattedMessage
                            id="forms.SummaryInfoForm.fields.smallBusiness.dateEstablished.label"
                            values={{
                              dateEstablished: businessData.dateEstablished,
                              registrationState: businessData.registrationState,
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormattedMessage
                            id="forms.SummaryInfoForm.fields.smallBusiness.address.label"
                            defaultMessage="The business address is:"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormattedMessage
                            id="forms.SummaryInfoForm.fields.smallBusiness.addressAptSuiteNumber.label"
                            values={{
                              addressAptSuiteNumber: businessData.addressAptSuiteNumber,
                              addressStreet: businessData.addressStreet,
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormattedMessage
                            id="forms.SummaryInfoForm.fields.smallBusiness.addressCityState.label"
                            values={{
                              addressCity: businessData.addressCity,
                              addressState: businessData.addressState,

                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormattedMessage
                            id="forms.SummaryInfoForm.fields.smallBusiness.addressZip.label"
                            values={{
                              addressZip: businessData.addressZip,
                              b: chunks => <strong>{chunks}</strong>,
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </FormActionsWrapper>
              )}
              <div className="row no-gutters justify-content-center">
                <div className="col-16 col-lg-8 d-flex justify-content-between" id="form-section-heading">
                  <FormattedMessage className="fortifid-form-fields"
                    id="forms.SummaryInfoForm.fields.personal.label"
                    defaultMessage="Personal Information"
                  />
                  <NavigationLink onClick={() => this.props.dispatch(actionSettingsChange({ editForm: true }))} className="fortifid-link-navigation edit-link" to="/#basicInfoForm">
                    <FormattedMessage id="forms.SummaryInfoForm.fields.edit.label" defaultMessage="Edit" />
                  </NavigationLink>
                </div>
              </div>
              <FormActionsWrapper>
                <table className="personal-info">
                  <tbody>
                    <tr>
                      <td>Full Name:</td>
                      <td><FormattedMessage
                        id="forms.SummaryInfoForm.fields.personal.fullName.label"
                        values={{
                          // firstName: individualData.firstName,
                          firstName: individualData.firstName,
                          middleName: individualData.middleName,
                          lastName: individualData.lastName,
                          b: chunks => <strong>{chunks}</strong>,
                        }}
                      /></td>
                    </tr>
                    <tr>
                      <td >SSN:</td>
                      <td>
                        {
                          this.state.ssn ?
                            <FormattedMessage
                              id="forms.SummaryInfoForm.fields.personal.federalIdNumber.label"
                              values={{
                                fid: `${this.mask(individualData.federalIdNumber)}`,
                                b: chunks => <strong>{chunks}</strong>,
                              }}
                            /> :
                            <FormattedMessage
                              id="forms.SummaryInfoForm.fields.personal.federalIdNumber.label"
                              values={{
                                fid: individualData.federalIdNumber,
                                b: chunks => <strong>{chunks}</strong>,
                              }}
                            />}
                        <button type="button" onClick={() => this.setState({ ssn: !this.state.ssn })} className="SSNButton">
                          {this.state.ssn ? 'Show' : 'Hide'}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td >DOB:</td>
                      <td><FormattedMessage
                        id="forms.SummaryInfoForm.fields.personal.dateOfBirth.label"
                        values={{
                          dob: moment(individualData.birthDate).format("MM/DD/YYYY"),
                          b: chunks => <strong>{chunks}</strong>,
                        }}
                      />
                      </td>
                    </tr>
                    <tr>
                      <td >Phone Number:</td>
                      <td>  <FormattedMessage
                        id="forms.SummaryInfoForm.fields.personal.phoneNumber.label"
                        values={{
                          phone: beautifyPhoneNumber(individualData.mobilePhone),
                          b: chunks => <strong>{chunks}</strong>,
                        }}
                      />
                      </td>
                    </tr>
                    <tr>
                      <td >Email Address:</td>
                      <td> <FormattedMessage
                        id="forms.SummaryInfoForm.fields.personal.emailAddress.label"
                        values={{
                          email: individualData.emailAddress,
                          b: chunks => <strong>{chunks}</strong>,
                        }}
                      /></td>
                    </tr>
                  </tbody>
                </table>

                <br />
                <table>
                  <tbody>
                    <tr>
                      <td> <FormattedMessage
                        id="forms.SummaryInfoForm.fields.personal.isUSCitizen.label"
                        values={{
                          citizen: `${individualData.isUSCitizen ? "a U.S. Citizen." : "not a U.S. Citizen."}`,
                          b: chunks => <strong>{chunks}</strong>,
                        }}
                      /></td>
                    </tr>
                    <tr>
                      <td>
                        <FormattedMessage
                          id="forms.SummaryInfoForm.fields.personal.driversLicense.label"
                          values={{
                            license: individualData.driversLicenseNumber,
                            state: individualData.driversLicenseState,
                            expires: individualData.driversLicenseExpireDate,
                            b: chunks => <strong>{chunks}</strong>,
                          }}
                        />
                      </td>
                    </tr>
                    {individualData.coApplication &&
                      <tr>
                        <td>
                          Copplicant Full Name:
                          {individualData.coApplication && (
                            <FormattedMessage
                              id="forms.SummaryInfoForm.fields.personal.coApplicationFullName.label"
                              values={{
                                firstName: individualData.coApplicationFirstName,
                                middleName: individualData.coApplicationMiddleName,
                                lastName: individualData.coApplicationLastName,
                                b: chunks => <strong>{chunks}</strong>,
                              }}
                            />
                          )}
                          {individualData.coApplication && (
                            <br />
                          )}
                        </td>
                      </tr>
                    }

                    {individualData.coApplication &&
                      <tr>
                        <td>
                          CoApplicant Email Address:
                          {individualData.coApplication && (
                            <FormattedMessage
                              id="forms.SummaryInfoForm.fields.personal.coApplicationEmailAddress.label"
                              values={{
                                email: individualData.coApplicationEmailAddress,
                                b: chunks => <strong>{chunks}</strong>,
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    }

                  </tbody>
                </table>
              </FormActionsWrapper>

              <div className="row no-gutters justify-content-center">
                <div className="col-16 col-lg-8 d-flex justify-content-between" id="form-section-heading">
                  <FormattedMessage className="fortifid-form-fields"
                    id="forms.SummaryInfoForm.fields.residentialAddress.label"
                    defaultMessage="Residential Address Information"
                  />
                  <NavigationLink onClick={() => this.props.dispatch(actionSettingsChange({ editForm: true }))} className="fortifid-link-navigation edit-link" to="/#addressForm">
                    <FormattedMessage id="forms.SummaryInfoForm.fields.edit.label" defaultMessage="Edit" />
                  </NavigationLink>
                </div>
              </div>
              <FormActionsWrapper>
                {individualData.homeMonthlyRentMortgage !== undefined && individualData.homeMonthlyRentMortgage !== null && (
                  <FormattedMessage
                    id="forms.SummaryInfoForm.fields.residentialAddress.summaryPropertyType.label"
                    values={{
                      rent: `${this.currency(individualData.homeMonthlyRentMortgage)}`,
                      rentPropertType: individualData.homeRentOrOwn,
                      b: chunks => <strong>{chunks}</strong>,
                    }}
                  />
                )}
                {Boolean(individualData.homeIsFullyOwnedNoMortgage) && (
                  <FormattedMessage id="forms.SummaryInfoForm.fields.residentialAddress.homeIsFullyOwnedNoMortgage.label" />
                )}
                {individualData.homeAdditionalDetails !== undefined && individualData.homeAdditionalDetails !== null && (
                  <FormattedMessage
                    id="forms.SummaryInfoForm.fields.residentialAddress.homeAdditionalDetails.label"
                    values={{
                      other: individualData.homeAdditionalDetails,
                      b: chunks => <strong>{chunks}</strong>,
                    }}
                  />
                )}
                <br />
                <FormattedMessage
                  id="forms.SummaryInfoForm.fields.residentialAddress.addressAptSuiteNumber.label"
                  values={{
                    addressAptSuiteNumber: individualData.addressAptSuiteNumber,
                    addressStreet: individualData.addressStreet,
                    b: chunks => <strong>{chunks}</strong>,
                  }}
                />
                <br />
                <FormattedMessage
                  id="forms.SummaryInfoForm.fields.residentialAddress.addressCityState.label"
                  values={{
                    addressCity: individualData.addressCity,
                    addressState: individualData.addressState,
                    b: chunks => <strong>{chunks}</strong>,
                  }}
                />
                <br />
                <FormattedMessage
                  id="forms.SummaryInfoForm.fields.residentialAddress.addressCityStateZip.label"
                  values={{
                    addressZip: individualData.addressZip,
                    b: chunks => <strong>{chunks}</strong>,
                  }}
                />
                <br />
                <FormattedMessage
                  id="forms.SummaryInfoForm.fields.residentialAddress.addressMonths.label"
                  values={{
                    addressMonths: individualData.addressLivePeriod,
                    monthsText: individualData.addressLivePeriod <= 1 ? 'month' : 'months',
                    b: chunks => <strong>{chunks}</strong>,
                  }}
                />
              </FormActionsWrapper>
              {individualData.addressLivePeriod < FORMER_ADDRESS_THRESHOLD && (
                <div className="row no-gutters justify-content-center fortifid-summary-form__former">
                  <div className="col-16 col-lg-8">
                    <FormattedMessage
                      id="forms.SummaryInfoForm.fields.residentialAddress.formerAddress"
                      defaultMessage="You previously lived in this property:"
                    />
                    <br />
                    <FormattedMessage
                      id="forms.SummaryInfoForm.fields.residentialAddress.addressAptSuiteNumber.label"
                      values={{
                        addressAptSuiteNumber: individualData.formerAddressAptSuiteNumber,
                        addressStreet: individualData.formerAddressStreet,
                        b: chunks => <strong>{chunks}</strong>,
                      }}
                    />
                    <br />
                    <FormattedMessage
                      id="forms.SummaryInfoForm.fields.residentialAddress.addressCityState.label"
                      values={{
                        addressCity: individualData.formerAddressCity,
                        addressState: individualData.formerAddressState,
                        b: chunks => <strong>{chunks}</strong>,
                      }}
                    />
                    <br />
                    <FormattedMessage
                      id="forms.SummaryInfoForm.fields.residentialAddress.addressCityStateZip.label"
                      values={{
                        addressZip: individualData.formerAddressZip,
                        b: chunks => <strong>{chunks}</strong>,
                      }}
                    />
                    <br />
                    <FormattedMessage
                      id="forms.SummaryInfoForm.fields.residentialAddress.addressMonths.label"
                      values={{
                        addressMonths: individualData.formerAddressLivePeriod,
                        monthsText: individualData.formerAddressLivePeriod <= 1 ? 'month' : 'months',
                        b: chunks => <strong>{chunks}</strong>,
                      }}
                    />
                  </div>
                </ div>
              )}
              <div className="row no-gutters justify-content-center">
                <div className="col-16 col-lg-8 d-flex justify-content-between" id="form-section-heading">
                  <FormattedMessage className="fortifid-form-fields"
                    id="forms.SummaryInfoForm.fields.income.label"
                    defaultMessage="Income Information"
                  />
                  <NavigationLink onClick={() => this.props.dispatch(actionSettingsChange({ editForm: true }))} className="fortifid-link-navigation edit-link" to="/#incomeInfoForm">
                    <FormattedMessage id="forms.SummaryInfoForm.fields.edit.label" defaultMessage="Edit" />
                  </NavigationLink>
                </div>
              </div>
              <FormActionsWrapper>
                {individualData.incomeSource === EmploymentStatuses.UNEMPLOYED ? (
                    <FormattedMessage
                      id="forms.SummaryInfoForm.fields.income.unemployed.label"
                      values={{
                        incomeSource: individualData.incomeSource,
                        b: chunks => <strong>{chunks}</strong>,
                      }}
                    />
                ) : (
                  <React.Fragment>
                    <FormattedMessage
                      id="forms.SummaryInfoForm.fields.income.incomeSource.label"
                      values={{
                        incomeSource: `${individualData.incomeSource}`,
                        b: chunks => <strong>{chunks}</strong>,
                      }}
                    />
                    <br />
                    <FormattedMessage
                      id="forms.SummaryInfoForm.fields.income.incomeIndividualAnnualGross.label"
                      values={{
                        incomeIndividualAnnualGross: `${this.currency(individualData.incomeIndividualAnnualGross)}`,
                        b: chunks => <strong>{chunks}</strong>,
                      }}
                    />
                    <br />
                    <FormattedMessage
                      id="forms.SummaryInfoForm.fields.income.incomeHouseholdAnnualGross.label"
                      values={{
                        incomeHouseholdAnnualGross: `${this.currency(individualData.incomeHouseholdAnnualGross)}`,
                        b: chunks => <strong>{chunks}</strong>,
                      }}
                    />
                    <br />
                    <FormattedMessage
                      id="forms.SummaryInfoForm.fields.income.netIncome.label"
                      values={{
                        netIncome: `${this.currency(individualData.netIncome)}`,
                        b: chunks => <strong>{chunks}</strong>,
                      }}
                    />
                  </React.Fragment>
                )}
                <br />
                <br />
                {individualData.financialAccountType !== FinancialAccountTypes.none && (
                  <FormattedMessage
                    id="forms.SummaryInfoForm.fields.income.financial.label"
                    values={{
                      financialAccountType: individualData.financialAccountType,
                      financialBankName: individualData.financialBankName,
                      b: chunks => <strong>{chunks}</strong>,
                    }}
                  />
                )}
                <br />
                <FormattedMessage
                  id="forms.SummaryInfoForm.fields.income.financialCreditCardCashAdvStatus.label"
                  values={{
                    financialCreditCardCashAdvStatus: `${individualData.financialCreditCardCashAdvStatus === FinancialCashAdvanceStatus.zero ?
                      "You have NOT taken a cash advance in the past 6 months" : "You have taken a cash advance in the past 6 months"}`,
                    b: chunks => <strong>{chunks}</strong>,
                  }}
                />
              </FormActionsWrapper>
              <div className="row no-gutters justify-content-center">
                <div className="col-16 col-lg-8 d-flex justify-content-between" id="form-section-heading">
                  <FormattedMessage className="fortifid-form-fields"
                    id="forms.SummaryInfoForm.fields.employment.label"
                    defaultMessage="Employment Information"
                  />
                  <NavigationLink onClick={() => this.props.dispatch(actionSettingsChange({ editForm: true }))} className="fortifid-link-navigation edit-link" to="/#employmentInfoForm">
                    <FormattedMessage id="forms.SummaryInfoForm.fields.edit.label" defaultMessage="Edit" />
                  </NavigationLink>
                </div>
              </div>
              {individualData.employmentStatus === EmploymentStatuses.UNEMPLOYED ? (
                <FormActionsWrapper>
                  <FormattedMessage
                    id="forms.SummaryInfoForm.fields.employment.unemployed.label"
                    values={{
                      employmentStatus: individualData.employmentStatus,
                      b: chunks => <strong>{chunks}</strong>,
                    }}
                  />
                </FormActionsWrapper>
              ) : (
                <FormActionsWrapper>
                  <FormattedMessage
                    id="forms.SummaryInfoForm.fields.employment.employed.label"
                    values={{
                      employmentStatus: individualData.employmentStatus,
                      employmentJobTitle: individualData.employmentJobTitle,
                      employmentMonths: individualData.employmentLength,
                      employmentEmployerName: individualData.employmentEmployerName,
                      monthsText: individualData.employmentLength <= 1 ? 'month' : 'months',
                      b: chunks => <strong>{chunks}</strong>,
                    }}
                  />
                  <br />
                  <FormattedMessage
                    id="forms.SummaryInfoForm.fields.employment.employmentPhoneNumber.label"
                    values={{
                      employmentPhoneNumber: individualData.employmentPhoneNumber,
                      b: chunks => <strong>{chunks}</strong>,
                    }}
                  />
                  <br />
                  <br />
                  <FormattedMessage id="forms.SummaryInfoForm.fields.employment.employmentAddress.label" />
                  <br />
                  <FormattedMessage
                    id="forms.SummaryInfoForm.fields.employment.employmentAddressAptSuiteNumber.label"
                    values={{
                      employmentAddressAptSuiteNumber: individualData.employmentAddressAptSuiteNumber,
                      employmentAddressStreet: individualData.employmentAddressStreet,
                      b: chunks => <strong>{chunks}</strong>,
                    }}
                  />
                  <br />
                  <FormattedMessage
                    id="forms.SummaryInfoForm.fields.employment.employmentAddressStateCity.label"
                    values={{
                      employmentAddressCity: individualData.employmentAddressCity,
                      employmentAddressState: individualData.employmentAddressState,
                      b: chunks => <strong>{chunks}</strong>,
                    }}
                  />
                  <br />
                  <FormattedMessage
                    id="forms.SummaryInfoForm.fields.employment.employmentAddressZip.label"
                    values={{
                      employmentAddressZip: individualData.employmentAddressZip,
                      b: chunks => <strong>{chunks}</strong>,
                    }}
                  />

                </FormActionsWrapper>
              )}
              <div className="row no-gutters justify-content-center">
                <div className="col-16 col-lg-8 terms-section">
                  <FormattedMessage className="fortifid-form-fields"
                    id="forms.SummaryInfoForm.fields.submission.label"
                    defaultMessage="Please make sure you enter the correct information. Once it is submitted, it cannot be changed."
                  />
                </div>
              </div>
              <div className="summary-btn">
                <FormActionsWrapper>
                  <TertiaryButton size="medium" onClick={this.props.onPrev}>
                    <Icon name="Previous" className="fortifid-icon__previous" />
                    <FormattedMessage id="prevButton" defaultMessage="Previous" />
                  </TertiaryButton>
                  <PrimaryButton className="cta-button" disabled={submitting || submitDisabled} type="submit" size="medium">
                    <FormattedMessage id={isLastForm ? "submitButton" : "forms.SummaryInfoForm.submit"} defaultMessage="Submit" />
                  </PrimaryButton>
                </FormActionsWrapper>
              </div>
            </form>
          )}
        />
      </div>
    )
  }
}

export default connect(state => ({
  applicationData: state.applicationData,
  individualData: state.individualData,
  businessData: state.businessData,
  settings: state.settings,
}))(injectIntl(SummaryInfoForm))
