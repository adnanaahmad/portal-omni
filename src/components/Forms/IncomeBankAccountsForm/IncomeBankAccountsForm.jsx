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
import { WhenFieldChanges } from "components/Shared/Form/FormHelpers"
import FinancialAccountTypes from "data/FinancialAccountTypes.json"
import FinancialCashAdvanceStatus from "data/FinancialCashAdvanceStatus.json"
import ReviewButton from "../../Shared/Button/ReviewButton"

import "./IncomeBankAccountsForm.scss";

export class IncomeBankAccountsFormFields extends Component {

  render () {
    const {
      data: {
        intl,
        values
      }
    } = this.props
    return(
      <FormFieldsWrapper>
        <div>
          <WhenFieldChanges field="noAccount" becomes={true} set="financialAccountType" to={FinancialAccountTypes.none} />
          <WhenFieldChanges field="noAccount" becomes={false} set="financialAccountType" to={undefined} />
          <WhenFieldChanges field="noAccount" becomes={true} set="financialBankName" to={undefined} />

          <FormField
            name="financialAccountType"
            disabled={values.noAccount}

            data={{
              name: "financialAccountType",
              type: FIELD_TYPES.radio,
              style: "horizontal",
              label: intl.formatMessage({
                id: "forms.IncomeBankAccountsForm.fields.financialAccountType.label",
              }),
              options: [
                {
                  label: intl.formatMessage({
                    id: "forms.IncomeBankAccountsForm.fields.financialAccountType.optionChecking",
                  }),
                  value: FinancialAccountTypes.checking,
                },
                {
                  label: intl.formatMessage({
                    id: "forms.IncomeBankAccountsForm.fields.financialAccountType.optionSavings",
                  }),
                  value: FinancialAccountTypes.savings,
                },
                {
                  label: intl.formatMessage({
                    id: "forms.IncomeBankAccountsForm.fields.financialAccountType.optionBoth",
                  }),
                  value: FinancialAccountTypes.both,
                },
              ],
            }}
            validate={composeValidators(...[Validators.required(intl.formatMessage({ id: "formErrors.requiredField" }))])}
          />

          <FormField
            name="financialBankName"
            disabled={values.noAccount}
            data={{
              label: intl.formatMessage({
                id: "forms.IncomeBankAccountsForm.fields.financialBankName.label",
              }),
              maxLength: 50,
              name: "financialBankName",
              required: true,
              type: FIELD_TYPES.text,
            }}
            validate={value =>
              values.noAccount
                ? undefined
                : composeValidators(
                  ...[
                    Validators.required(
                      intl.formatMessage({
                        id: "formErrors.requiredField",
                      })
                    ),
                    Validators.bankName(
                      intl.formatMessage({
                        id: "forms.IncomeBankAccountsForm.fields.financialBankName.error",
                      })
                    ),
                  ]
                )(value)
            }
          />

          <FormField
            name="financialCreditCardCashAdvStatus"
            data={{
              name: "financialCreditCardCashAdvStatus",
              type: "radio",
              style: "horizontal",
              label: intl.formatMessage({
                id: "forms.IncomeBankAccountsForm.fields.financialCreditCardCashAdvStatus.label",
              }),
              options: [
                {
                  label: intl.formatMessage({
                    id: "forms.IncomeBankAccountsForm.fields.financialCreditCardCashAdvStatus.optionZero",
                  }),
                  value: FinancialCashAdvanceStatus.zero,
                },
                {
                  label: intl.formatMessage({
                    id: "forms.IncomeBankAccountsForm.fields.financialCreditCardCashAdvStatus.optionOne",
                  }),
                  value: FinancialCashAdvanceStatus.one,
                },
                {
                  label: intl.formatMessage({
                    id: "forms.IncomeBankAccountsForm.fields.financialCreditCardCashAdvStatus.optionMore",
                  }),
                  value: FinancialCashAdvanceStatus.more,
                },
              ],
            }}
            validate={composeValidators(...[Validators.required(intl.formatMessage({ id: "formErrors.requiredField" }))])}
          />
        </div>
      </FormFieldsWrapper>
    )
  }
}

class IncomeBankAccountsForm extends Component {
  submit = async values => {
    const { noAccount, ...rest } = values;
    this.props.onSubmit(rest)
  }

  render() {
    const {
      intl,
      individualData: { financialAccountType, financialCreditCardCashAdvStatus, financialBankName },
      settings: { submitDisabled },
    } = this.props
    return (
      <div className="fortifid-income-housing">
        <PageHeading title={<FormattedMessage id="forms.IncomeBankAccountsForm.title" />} />
        <Form
          initialValues={{
            financialAccountType,
            noAccount: financialAccountType === FinancialAccountTypes.none,
            financialCreditCardCashAdvStatus,
            financialBankName,
          }}
          onSubmit={this.submit}
          render={({ handleSubmit, submitting, values }) => (
            <form onSubmit={handleSubmit}>
              <IncomeBankAccountsFormFields data={{intl, values}}/>
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
}))(injectIntl(IncomeBankAccountsForm))
