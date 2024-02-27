import React, { Component } from "react"
import { connect } from "react-redux"
import { Form } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import FormField, { FIELD_TYPES } from "components/Shared/Form/FormField/FormField"
import Icon from "components/Shared/Icon/Icon"
import { Validators, composeValidators } from "components/Shared/Form/validators"
import PageHeading from "components/PageHeading/PageHeading"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import { FormFieldsWrapper, FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import INCOME_SOURCES from "data/IncomeSources.json"
import EmploymentStatuses from "data/EmploymentStatuses.json"
import "./IncomeInformationForm.scss"
import { WhenFieldChanges } from "components/Shared/Form/FormHelpers";
import FinancialAccountTypes from "data/FinancialAccountTypes.json";
import FinancialCashAdvanceStatus from "data/FinancialCashAdvanceStatus.json"
import { actionExistingDataFormSubmit } from "../../state/actions";
import FormNames from "../../../constants/forms";
import { IncomeBankAccountsFormFields } from "../IncomeBankAccountsForm/IncomeBankAccountsForm"
import ReviewButton from "../../Shared/Button/ReviewButton"

class IncomeInformationForm extends Component {
  submit = async values => {
    values = this.handleUnemploymentCase(values);
    if (this.props.settings.editForm) {
      const { noAccount, ...rest } = values;
      this.props.onSubmit(rest)
    } else {
      this.props.onSubmit(values)
    }
  }
  editExistingCustomer = async values => {
    values = this.handleUnemploymentCase(values);
    this.props.dispatch(actionExistingDataFormSubmit(values, { formName: FormNames.FORM_INCOME_INFO }));
  }

  componentDidUpdate() {
    if (this.props.settings.closeForm) {
      this.props.cancel();
    }
  }

  handleUnemploymentCase (values) {
    if (values.incomeSource === EmploymentStatuses.UNEMPLOYED) {
      values.incomeIndividualAnnualGross = '';
      values.incomeHouseholdAnnualGross = '';
      values.netIncome = '';
    }
    return values;
  }

  render() {
    let {
      intl,
      individualData: { 
        incomeSource,
        incomeIndividualAnnualGross,
        incomeHouseholdAnnualGross,
        netIncome,
        financialAccountType,
        financialCreditCardCashAdvStatus,
        financialBankName
      },
      settings: { submitDisabled },
      existingCustomerData
    } = this.props;


    // update variables from existingCustomerData state if existing customer is editing income info form in summary page
    let existingCustomerIncomeInfo = {};
    if(this.props.editExistingCustomer) existingCustomerIncomeInfo = existingCustomerData.incomeData;
    

    let additionalFieldsForIndividualCustomer = {}
    // update addtional fields from individual data when new customer is editing income info form in summary page
    if(this.props.settings.editForm) {
      additionalFieldsForIndividualCustomer = {
        financialAccountType,
        noAccount: financialAccountType === FinancialAccountTypes.none,
        financialCreditCardCashAdvStatus,
        financialBankName,
      }
    }

    return (
      <div className="fortifid-income-information">
        <PageHeading title={<FormattedMessage id="forms.IncomeInformationForm.title" />} />
        <Form
          initialValues={{
            incomeSource,
            incomeIndividualAnnualGross,
            incomeHouseholdAnnualGross,
            netIncome,
            ...existingCustomerIncomeInfo,
            ...additionalFieldsForIndividualCustomer
          }}
          onSubmit={!this.props.editExistingCustomer ? this.submit : this.editExistingCustomer}
          render={({ handleSubmit, submitting, values }) => {
            const disabledIfUnemployed = values.incomeSource === EmploymentStatuses.UNEMPLOYED;
            return (
            <form onSubmit={handleSubmit}>
              <FormFieldsWrapper>
                <div>
                  <FormField
                    name="incomeSource"
                    isSearchable={true}
                    data={{
                      label: intl.formatMessage({
                        id: "forms.IncomeInformationForm.fields.incomeSource.label",
                      }),
                      name: "incomeSource",
                      options: INCOME_SOURCES.map(option => ({
                        label: intl.formatMessage({
                          id: `INCOME_SOURCES."${option}"`,
                          defaultMessage: option,
                        }),
                        value: option,
                      })),
                      required: true,
                      type: "select",
                    }}
                    validate={composeValidators(
                      ...[
                        Validators.required(
                          intl.formatMessage({
                            id: "forms.IncomeInformationForm.fields.incomeSource.error",
                          })
                        ),
                      ]
                    )}
                  />
                  <FormField
                    name="incomeIndividualAnnualGross"
                    disabled={disabledIfUnemployed}
                    data={{
                      allowDecimals: false,
                      allowNegativeValue: false,
                      disableAbbreviations: true,
                      intlConfig: { locale: intl.locale, currency: "USD" },
                      label: intl.formatMessage({
                        id: "forms.IncomeInformationForm.fields.incomeIndividualAnnualGross.label",
                      }),
                      hint: intl.formatMessage({
                        id: "forms.IncomeInformationForm.fields.incomeIndividualAnnualGross.hint",
                      }),
                      maxLength: 12,
                      name: "incomeIndividualAnnualGross",
                      required: !disabledIfUnemployed,
                      type: "currency",
                    }}
                    validate={(value, allValues) =>
                      allValues.incomeSource === EmploymentStatuses.UNEMPLOYED
                        ? undefined
                        : composeValidators(
                            ...[
                              Validators.required(
                                intl.formatMessage({
                                  id: "formErrors.requiredField",
                                })
                              ),
                              Validators.number(
                                intl.formatMessage({
                                  id: "forms.IncomeInformationForm.fields.incomeIndividualAnnualGross.error",
                                })
                              ),
                            ]
                          )(value, allValues)
                    }
                  />
                  <FormField
                    name="incomeHouseholdAnnualGross"
                    disabled={disabledIfUnemployed}
                    data={{
                      allowDecimals: false,
                      allowNegativeValue: false,
                      disableAbbreviations: true,
                      intlConfig: { locale: intl.locale, currency: "USD" },
                      label: intl.formatMessage({
                        id: "forms.IncomeInformationForm.fields.incomeHouseholdAnnualGross.label",
                      }),
                      hint: intl.formatMessage({
                        id: "forms.IncomeInformationForm.fields.incomeHouseholdAnnualGross.hint",
                      }),
                      maxLength: 12,
                      name: "incomeHouseholdAnnualGross",
                      required: !disabledIfUnemployed,
                      type: "currency",
                    }}
                    validate={(value, allValues) =>
                      allValues.incomeSource === EmploymentStatuses.UNEMPLOYED
                        ? undefined
                        : composeValidators(
                            ...[
                              Validators.required(
                                intl.formatMessage({
                                  id: "formErrors.requiredField",
                                })
                              ),
                              Validators.number(
                                intl.formatMessage({
                                  id: "forms.IncomeInformationForm.fields.incomeHouseholdAnnualGross.error",
                                })
                              ),
                              (value, allValues) =>
                                value &&
                                allValues["incomeIndividualAnnualGross"]
                                  ? parseFloat(value) >=
                                    parseFloat(
                                      allValues["incomeIndividualAnnualGross"]
                                    )
                                    ? undefined
                                    : intl.formatMessage({
                                        id: "forms.IncomeInformationForm.fields.incomeHouseholdAnnualGross.valueError",
                                      })
                                  : undefined,
                            ]
                          )(value, allValues)
                    }
                  />

                  <FormField
                    name="netIncome"
                    disabled={disabledIfUnemployed}
                    data={{
                      allowDecimals: false,
                      allowNegativeValue: false,
                      disableAbbreviations: true,
                      intlConfig: { locale: intl.locale, currency: "USD" },
                      label: intl.formatMessage({
                        id: "forms.IncomeInformationForm.fields.netIncome.label",
                      }),
                      hint: intl.formatMessage({
                        id: "forms.IncomeInformationForm.fields.netIncome.hint",
                      }),
                      maxLength: 12,
                      name: "netIncome",
                      required: !disabledIfUnemployed,
                      type: "currency",
                    }}
                    validate={(value, allValues) =>
                      allValues.incomeSource === EmploymentStatuses.UNEMPLOYED
                        ? undefined
                        : composeValidators(
                            ...[
                              Validators.required(
                                intl.formatMessage({
                                  id: "formErrors.requiredField",
                                })
                              ),
                              Validators.number(
                                intl.formatMessage({
                                  id: "forms.IncomeInformationForm.fields.netIncome.error",
                                })
                              ),
                              // (value, allValues) =>
                              //   value && allValues["incomeIndividualAnnualGross"]
                              //     ? parseFloat(value) >= parseFloat(allValues["incomeIndividualAnnualGross"])
                              //       ? undefined
                              //       : intl.formatMessage({
                              //         id: "forms.IncomeInformationForm.fields.netIncome.valueError",
                              //       })
                              //     : undefined,
                            ]
                          )(value, allValues)
                    }
                  />
                </div>
              </FormFieldsWrapper>
              {
                (this.props.editExistingCustomer || this.props.settings.editForm) &&
                <IncomeBankAccountsFormFields data={{intl, values}}/>
              }
              {
                (!this.props.editExistingCustomer && !this.props.settings.editForm) &&
                <FormActionsWrapper>
                  <TertiaryButton size="medium" onClick={this.props.onPrev}>
                    <Icon name="Previous" className="fortifid-icon__previous" />
                    <FormattedMessage id="prevButton" defaultMessage="Previous" />
                  </TertiaryButton>
                  <ReviewButton backToReview={this.props.onReview} />
                  <PrimaryButton className="cta-button" disabled={submitting || submitDisabled} type="submit" size="medium">
                    <FormattedMessage id="nextButton" defaultMessage="Submit" />
                    <Icon name="Next" className="fortifid-icon__next" />
                  </PrimaryButton>
                </FormActionsWrapper>
              }
              {
                (this.props.editExistingCustomer || this.props.settings.editForm) &&
                <FormActionsWrapper>
                  <TertiaryButton size="medium" onClick={this.props.editExistingCustomer ? this.props.cancel : this.props.onReview}>
                    <FormattedMessage id="cancelButton" defaultMessage="Cancel" />
                  </TertiaryButton>
                  <PrimaryButton className="cta-button" disabled={submitting || submitDisabled} type="submit" size="medium"  >
                      <FormattedMessage id="saveButton" defaultMessage="Save" />
                  </PrimaryButton>
                </FormActionsWrapper>
              }
            </form>
          )}}
        />
      </div>
    )
  }
}

export default connect(state => ({
  applicationData: state.applicationData,
  individualData: state.individualData,
  businessData: state.businessData,
  existingCustomerData: state.existingCustomerData,
  settings: state.settings,
}))(injectIntl(IncomeInformationForm))
