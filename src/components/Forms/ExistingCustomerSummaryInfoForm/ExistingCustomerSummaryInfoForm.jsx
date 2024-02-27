import React, { Component } from "react"
import { connect } from "react-redux"
import { Form } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import Icon from "components/Shared/Icon/Icon"
import PageHeading from "components/PageHeading/PageHeading"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import { FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import EmploymentStatuses from "data/EmploymentStatuses.json"
import FinancialAccountTypes from "data/FinancialAccountTypes.json"
import FinancialCashAdvanceStatus from "data/FinancialCashAdvanceStatus.json"
import LOAN_TYPES from "data/LoanTypes"
import moment from "moment"

import "./ExistingCustomerSummaryInfoForm.scss"
import beautifyPhoneNumber from "../../../constants/beautifyPhoneNumber"

import FormNames from "../../../constants/forms";
import BasicInfoForm from "../BasicInfoForm/BasicInfoForm";
import AddressInfoForm from "../AddressInfoForm/AddressInfoForm";
import IncomeInformationForm from "../IncomeInformationForm/IncomeInformationForm";
import EmploymentInfoForm from "../EmploymentInfoForm/EmploymentInfoForm";
import BusinessInfoForm from "../BusinessInfoForm/BusinessInfoForm";
import { TextButton } from "../../Shared/Button/Button"
import { actionSettingsChange } from "../../state/actions"
import { FORMER_ADDRESS_THRESHOLD } from "../../../constants/common"

class ExistingCustomerSummaryInfoForm extends Component {
    constructor() {
        super();
        this.state = { ssn: true, fid: true, editForm: null }
    }
    submit = values => {
        //const { applicationData } = this.props;
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

    cancel = () => {
        this.setState({editForm: null});
        this.props.dispatch(actionSettingsChange({ submitDisabled: false, closeForm: false }));
    }

    render() {
        const {
            isLastForm,
            applicationData,
            existingCustomerData: {
                personalData,
                coApplicantData,
                addressData,
                incomeData,
                employmentData,
                businessData
            },
            settings: { submitDisabled }
        } = this.props

        // console.log('form', this.state.editForm);
        // console.log(this.props.existingCustomerData);
        // console.log(this.props.applicationData);
        switch(this.state.editForm) {
            case FormNames.FORM_BASIC_INFO:
                return(<BasicInfoForm editExistingCustomer={true} cancel={this.cancel}/>);
                //break;
            case FormNames.FORM_ADDRESS:
                return(<AddressInfoForm editExistingCustomer={true} cancel={this.cancel}/>);
                //break;
            case FormNames.FORM_INCOME_INFO:
                return(<IncomeInformationForm editExistingCustomer={true} cancel={this.cancel}/>);
                //break;
            case FormNames.FORM_EMPLOYMENT_INFO:
                return(<EmploymentInfoForm editExistingCustomer={true} cancel={this.cancel}/>);
            case FormNames.FORM_BUSINESS_INFO:
                return(<BusinessInfoForm editExistingCustomer={true} cancel={this.cancel}/>);
                //break;
            default:
                return (
                    <div className="fortifid-summary-form">
                        <PageHeading title={<FormattedMessage id="forms.SummaryInfoForm.title" />} />
                        <Form
                            onSubmit={this.submit}
                            render={({ handleSubmit, submitting }) => (
                                <form onSubmit={handleSubmit}>

                                    {(applicationData.loanType === LOAN_TYPES.small_business) && <>
                                        <div className="row no-gutters justify-content-center">
                                        <div className="col-16 col-lg-8 d-flex justify-content-between" id="form-section-heading">
                                            <FormattedMessage className="fortifid-form-fields"
                                                id="forms.SummaryInfoForm.fields.smallBusiness.label"
                                                defaultMessage="Business Information"
                                            />
                                            <TextButton className="edit-btn" onClick={() => this.setState({ editForm: FormNames.FORM_BUSINESS_INFO })}>
                                                <FormattedMessage id="forms.SummaryInfoForm.fields.edit.label" defaultMessage="Edit Business Information" />
                                            </TextButton>
                                        </div>
                                    </div>
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
                                                                            {this.state.fid ? this.mask(businessData.federalIdNumber) : businessData.federalIdNumber}
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
                                                                    addressAptSuiteNumber: businessData.businessAddressAptSuiteNumber,
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
                                    </>}
                                    <div className="row no-gutters justify-content-center">
                                        <div className="col-16 col-lg-8 d-flex justify-content-between" id="form-section-heading">
                                            <FormattedMessage className="fortifid-form-fields"
                                                id="forms.SummaryInfoForm.fields.personal.label"
                                                defaultMessage="Personal Information"
                                            />
                                            <TextButton className="edit-btn" onClick={() => this.setState({ editForm: FormNames.FORM_BASIC_INFO })}>
                                                <FormattedMessage id="forms.SummaryInfoForm.fields.edit.label" defaultMessage="Edit Personal Information" />
                                            </TextButton>   
                                        </div>
                                    </div>
                                    <FormActionsWrapper>
                                        <table className="personal-info">
                                            <tbody>
                                                <tr>
                                                    <td>Full Name:</td>
                                                    <td><FormattedMessage
                                                        id="forms.SummaryInfoForm.fields.personal.ExistingfullName.label"
                                                        values={{
                                                            firstName: personalData.firstName,
                                                            middleName: personalData.middleName,
                                                            lastName: personalData.lastName,
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
                                                                    id="forms.SummaryInfoForm.fields.personal.ExistingfederalIdNumber.label"
                                                                    values={{
                                                                        fid: `${this.mask(personalData.federalIdNumber)}`,
                                                                        b: chunks => <strong>{chunks}</strong>,
                                                                    }}
                                                                /> :
                                                                <FormattedMessage
                                                                    id="forms.SummaryInfoForm.fields.personal.ExistingfederalIdNumber.label"
                                                                    values={{
                                                                        fid: personalData.federalIdNumber,
                                                                        b: chunks => <strong>{chunks}</strong>,
                                                                    }}
                                                                />
                                                        }
                                                        <button type="button" onClick={() => this.setState({ ssn: !this.state.ssn })} className="SSNButton">
                                                            {this.state.ssn ? 'Show' : 'Hide'}
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >DOB:</td>
                                                    <td><FormattedMessage
                                                        id="forms.SummaryInfoForm.fields.personal.ExistingdateOfBirth.label"
                                                        values={{
                                                            dob: moment(personalData.birthDate).format("MM/DD/YYYY"),
                                                            b: chunks => <strong>{chunks}</strong>,
                                                        }}
                                                    /></td>
                                                </tr>
                                                <tr>
                                                    <td >Phone Number:</td>
                                                    <td>  <FormattedMessage
                                                        id="forms.SummaryInfoForm.fields.personal.ExistingphoneNumber.label"
                                                        values={{
                                                            phone: beautifyPhoneNumber(personalData.mobilePhone),
                                                            b: chunks => <strong>{chunks}</strong>,
                                                        }}
                                                    /></td>
                                                </tr>
                                                <tr>
                                                    <td >Email Address:</td>
                                                    <td> <FormattedMessage
                                                        id="forms.SummaryInfoForm.fields.personal.ExistingemailAddress.label"
                                                        values={{
                                                            email: personalData.emailAddress,
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
                                                    <td>
                                                        <FormattedMessage
                                                        id="forms.SummaryInfoForm.fields.personal.isUSCitizen.label"
                                                        values={{
                                                            citizen: `${
                                                            personalData.isUSCitizen
                                                                ? "a U.S. Citizen."
                                                                : "not a U.S. Citizen."
                                                            }`,
                                                            b: (chunks) => (
                                                            <strong>{chunks}</strong>
                                                            ),
                                                        }}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <FormattedMessage
                                                            id="forms.SummaryInfoForm.fields.personal.driversLicense.label"
                                                            values={{
                                                                license: personalData.driversLicenseNumber,
                                                                state: personalData.driversLicenseState,
                                                                expires: personalData.driversLicenseExpireDate,
                                                                b: (chunks) => (
                                                                    <strong>{chunks}</strong>
                                                                ),
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                                {coApplicantData.coApplication === true && <>
                                                    <tr>
                                                        <td>
                                                            Copplicant Full Name :
                                                            <FormattedMessage
                                                                id="forms.SummaryInfoForm.fields.personal.coApplicationFullName.label"
                                                                values={{
                                                                    firstName: coApplicantData.coApplicationFirstName,
                                                                    middleName: coApplicantData.coApplicationMiddleName,
                                                                    lastName: coApplicantData.coApplicationLastName,
                                                                    b: chunks => <strong>{chunks}</strong>,
                                                                }}
                                                            />
                                                            <br />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            CoApplicant Email Address :
                                                            <FormattedMessage
                                                                id="forms.SummaryInfoForm.fields.personal.coApplicationEmailAddress.label"
                                                                values={{
                                                                    email: coApplicantData.coApplicationEmailAddress,
                                                                    b: chunks => <strong>{chunks}</strong>,
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                </>
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
                                            <TextButton className="edit-btn" onClick={() => this.setState({ editForm: FormNames.FORM_ADDRESS })}>
                                                <FormattedMessage id="forms.SummaryInfoForm.fields.edit.label" defaultMessage="Edit Address Information" />
                                            </TextButton>
                                        </div>
                                    </div>
                                    <FormActionsWrapper>
                                        {
                                            addressData.homeMonthlyRentMortgage && (
                                                <FormattedMessage
                                                    id="forms.SummaryInfoForm.fields.residentialAddress.propertyType.label"
                                                    values={{
                                                        monthly_rent: `${this.currency(addressData.homeMonthlyRentMortgage)}`,
                                                        propertyType: addressData.homeRentOrOwn,
                                                        b: chunks => <strong>{chunks}</strong>,
                                                    }}
                                                />
                                            )
                                        }
                                        {
                                            Boolean(addressData.homeIsFullyOwnedNoMortgage) && (
                                                <FormattedMessage id="forms.SummaryInfoForm.fields.residentialAddress.homeIsFullyOwnedNoMortgage.label" />
                                            )
                                        }
                                        {
                                            addressData.homeAdditionalDetails && (
                                                <FormattedMessage
                                                    id="forms.SummaryInfoForm.fields.residentialAddress.homeAdditionalDetails.label"
                                                    values={{
                                                    other: addressData.homeAdditionalDetails,
                                                    b: chunks => <strong>{chunks}</strong>,
                                                    }}
                                                />
                                            )
                                        }                                                             
  
                                        <br />
                                        <FormattedMessage
                                            id="forms.SummaryInfoForm.fields.residentialAddress.addressAptSuiteNumber.label"
                                            values={{
                                                addressStreet: addressData.addressStreet,
                                                addressAptSuiteNumber: addressData.addressAptSuiteNumber,
                                                b: chunks => <strong>{chunks}</strong>,
                                            }}
                                        />
                                        <br />
                                        <FormattedMessage
                                            id="forms.SummaryInfoForm.fields.residentialAddress.addressCityState.label"
                                            values={{
                                                addressCity: addressData.addressCity,
                                                addressState: addressData.addressState,
                                                b: chunks => <strong>{chunks}</strong>,
                                            }}
                                        />
                                        <br />
                                        <FormattedMessage
                                            id="forms.SummaryInfoForm.fields.residentialAddress.addressCityStateZip.label"
                                            values={{
                                                addressZip: addressData.addressZip,
                                                b: chunks => <strong>{chunks}</strong>,
                                            }}
                                        />
                                        <br />

                                        <FormattedMessage
                                            id="forms.SummaryInfoForm.fields.residentialAddress.addressMonths.label"
                                            values={{
                                                addressMonths: addressData.addressLivePeriod,
                                                monthsText: addressData.addressLivePeriod <= 1 ? 'month' : 'months',
                                                b: chunks => <strong>{chunks}</strong>,
                                            }}
                                        />
                                        <br />
                                    </FormActionsWrapper>
                                    {addressData.addressLivePeriod < FORMER_ADDRESS_THRESHOLD && (
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
                                                        addressAptSuiteNumber: addressData.formerAddressAptSuiteNumber,
                                                        addressStreet: addressData.formerAddressStreet,
                                                        b: chunks => <strong>{chunks}</strong>,
                                                    }}
                                                />
                                                <br />
                                                <FormattedMessage
                                                    id="forms.SummaryInfoForm.fields.residentialAddress.addressCityState.label"
                                                    values={{
                                                        addressCity: addressData.formerAddressCity,
                                                        addressState: addressData.formerAddressState,
                                                        b: chunks => <strong>{chunks}</strong>,
                                                    }}
                                                />
                                                <br />
                                                <FormattedMessage
                                                    id="forms.SummaryInfoForm.fields.residentialAddress.addressCityStateZip.label"
                                                    values={{
                                                        addressZip: addressData.formerAddressZip,
                                                        b: chunks => <strong>{chunks}</strong>,
                                                    }}
                                                />
                                                <br />
                                                <FormattedMessage
                                                    id="forms.SummaryInfoForm.fields.residentialAddress.addressMonths.label"
                                                    values={{
                                                        addressMonths: addressData.formerAddressLivePeriod,
                                                        monthsText: addressData.formerAddressLivePeriod <= 1 ? 'month' : 'months',
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
                                            <TextButton className="edit-btn" onClick={() => this.setState({ editForm: FormNames.FORM_INCOME_INFO })}>
                                                <FormattedMessage id="forms.SummaryInfoForm.fields.edit.label" defaultMessage="Edit Income Information" />
                                            </TextButton>
                                        </div>
                                    </div>
                                    <FormActionsWrapper>
                                        {incomeData.incomeSource ===
                                            EmploymentStatuses.UNEMPLOYED ? (
                                            <FormattedMessage
                                                id="forms.SummaryInfoForm.fields.income.unemployed.label"
                                                values={{
                                                incomeSource: incomeData.incomeSource,
                                                b: (chunks) => <strong>{chunks}</strong>,
                                                }}
                                            />
                                            ) : (
                                            <React.Fragment>
                                                <FormattedMessage
                                                id="forms.SummaryInfoForm.fields.income.incomeSource.label"
                                                values={{
                                                    incomeSource: `${incomeData.incomeSource}`,
                                                    b: (chunks) => <strong>{chunks}</strong>,
                                                }}
                                                />
                                                <br />
                                                <FormattedMessage
                                                id="forms.SummaryInfoForm.fields.income.incomeIndividualAnnualGross.label"
                                                values={{
                                                    incomeIndividualAnnualGross: `${this.currency(
                                                    incomeData.incomeIndividualAnnualGross
                                                    )}`,
                                                    b: (chunks) => <strong>{chunks}</strong>,
                                                }}
                                                />
                                                <br />
                                                <FormattedMessage
                                                id="forms.SummaryInfoForm.fields.income.incomeHouseholdAnnualGross.label"
                                                values={{
                                                    incomeHouseholdAnnualGross: `${this.currency(
                                                    incomeData.incomeHouseholdAnnualGross
                                                    )}`,
                                                    b: (chunks) => <strong>{chunks}</strong>,
                                                }}
                                                />
                                                <br />
                                                <FormattedMessage
                                                id="forms.SummaryInfoForm.fields.income.netIncome.label"
                                                values={{
                                                    netIncome: `${this.currency(
                                                    incomeData.netIncome
                                                    )}`,
                                                    b: (chunks) => <strong>{chunks}</strong>,
                                                }}
                                                />
                                            </React.Fragment>
                                        )}
                                        <br />
                                        <br />
                                        {incomeData.financialAccountType !== FinancialAccountTypes.none && (
                                            <FormattedMessage
                                                id="forms.SummaryInfoForm.fields.income.financial.label"
                                                values={{
                                                    financialAccountType: incomeData.financialAccountType,
                                                    financialBankName: incomeData.financialBankName,
                                                    b: chunks => <strong>{chunks}</strong>,
                                                }}
                                            />
                                        )}
                                        <br />
                                        <FormattedMessage
                                            id="forms.SummaryInfoForm.fields.income.financialCreditCardCashAdvStatus.label"
                                            values={{
                                                financialCreditCardCashAdvStatus: `${incomeData.financialCreditCardCashAdvStatus === FinancialCashAdvanceStatus.zero ?
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
                                            <TextButton className="edit-btn" onClick={() => this.setState({ editForm: FormNames.FORM_EMPLOYMENT_INFO })}>
                                                <FormattedMessage id="forms.SummaryInfoForm.fields.edit.label" defaultMessage="Edit Employment Information" />
                                            </TextButton>
                                        </div>
                                    </div>
                                    {employmentData.employmentStatus === EmploymentStatuses.UNEMPLOYED ? (
                                        <FormActionsWrapper>
                                            <FormattedMessage
                                                id="forms.SummaryInfoForm.fields.employment.unemployed.label"
                                                values={{
                                                    employmentStatus: employmentData.employmentStatus,
                                                    b: chunks => <strong>{chunks}</strong>,
                                                }}
                                            />
                                        </FormActionsWrapper>
                                    ) : (
                                        <FormActionsWrapper>
                                            <FormattedMessage
                                                id="forms.SummaryInfoForm.fields.employment.employed.label"
                                                values={{
                                                    employmentStatus: employmentData.employmentStatus,
                                                    employmentJobTitle: employmentData.employmentJobTitle,
                                                    employmentMonths: employmentData.employmentLength,
                                                    employmentEmployerName: employmentData.employmentEmployerName,
                                                    monthsText: employmentData.employmentLength <= 1 ? 'month' : 'months',
                                                    b: chunks => <strong>{chunks}</strong>,
                                                }}
                                            />
                                            <br />
                                            <FormattedMessage
                                                id="forms.SummaryInfoForm.fields.employment.employmentPhoneNumber.label"
                                                values={{
                                                    employmentPhoneNumber: employmentData.employmentPhoneNumber,
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
                                                    employmentAddressStreet: employmentData.employmentAddressStreet,
                                                    employmentAddressAptSuiteNumber: employmentData.employmentAddressAptSuiteNumber,
                                                    b: chunks => <strong>{chunks}</strong>,
                                                }}
                                            />
                                            <br />
                                            <FormattedMessage
                                                id="forms.SummaryInfoForm.fields.employment.employmentAddressStateCity.label"
                                                values={{
                                                    employmentAddressState: employmentData.employmentAddressState,
                                                    employmentAddressCity: employmentData.employmentAddressCity,
                                                    b: chunks => <strong>{chunks}</strong>,
                                                }}
                                            />
                                            <br />
                                            <FormattedMessage
                                                id="forms.SummaryInfoForm.fields.employment.employmentAddressZip.label"
                                                values={{
                                                    employmentAddressZip: employmentData.employmentAddressZip,
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
}

export default connect(state => ({
    applicationData: state.applicationData,
    settings: state.settings,
    existingCustomerData: state.existingCustomerData,
}))(injectIntl(ExistingCustomerSummaryInfoForm))
