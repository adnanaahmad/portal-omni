import React, { Component } from "react"
import { connect } from "react-redux"
import { Form } from "react-final-form"
import { FormattedMessage, injectIntl } from "react-intl"
import FormField, { FIELD_TYPES } from "components/Shared/Form/FormField/FormField"
import Icon from "components/Shared/Icon/Icon"
import { Validators, composeValidators } from "components/Shared/Form/validators"
import PageHeading from "components/PageHeading/PageHeading"
import { PrimaryButton, TertiaryButton } from "components/Shared/Button/Button"
import { Condition, WhenFieldChanges } from "components/Shared/Form/FormHelpers"
import { FormFieldsWrapper, FormActionsWrapper } from "components/FormWrappers/FormWrappers"
import OWNERSHIP_TYPES from "data/HomeOwnershipTypes.json"
import ReviewButton from "../../Shared/Button/ReviewButton"
import "./IncomeHousingForm.scss"
import { processIncomeHousingDetails } from "../AddressInfoForm/AddressInfoForm"

export class IncomeHousingFormFields extends Component {

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
          <FormField
            name="homeRentOrOwn"
            data={{
              name: "homeRentOrOwn",
              type: FIELD_TYPES.radio,
              style: "horizontal",
              label: intl.formatMessage({
                id: "forms.IncomeHousingForm.fields.homeRentOrOwn.label",
              }),
              options: [
                {
                  label: intl.formatMessage({
                    id: "forms.IncomeHousingForm.fields.homeRentOrOwn.optionRent",
                  }),
                  value: OWNERSHIP_TYPES.rent, // todo get from constants
                },
                {
                  label: intl.formatMessage({
                    id: "forms.IncomeHousingForm.fields.homeRentOrOwn.optionOwn",
                  }),
                  value: OWNERSHIP_TYPES.own,
                },
                {
                  label: intl.formatMessage({
                    id: "forms.IncomeHousingForm.fields.homeRentOrOwn.optionOther",
                  }),
                  value: OWNERSHIP_TYPES.other,
                },
              ],
            }}
            validate={composeValidators(...[Validators.required(intl.formatMessage({ id: "formErrors.requiredField" }))])}
          />
        </div>
        <Condition when="homeRentOrOwn" is={OWNERSHIP_TYPES.rent}>
          <FormField
            name="homeMonthlyRentMortgage"
            data={{
              allowDecimals: false,
              allowNegativeValue: false,
              disableAbbreviations: true,
              intlConfig: { locale: intl.locale, currency: "USD" },
              label: intl.formatMessage({
                id: "forms.IncomeHousingForm.fields.homeMonthlyRent.label",
              }),
              maxLength: 12,
              name: "homeMonthlyRentMortgage",
              required: true,
              type: FIELD_TYPES.currency,
            }}
            validate={composeValidators(
              ...[
                Validators.required(intl.formatMessage({ id: "formErrors.requiredField" })),
                Validators.number(
                  intl.formatMessage({
                    id: "forms.IncomeHousingForm.fields.homeMonthlyRent.error",
                  })
                ),
                Validators.minValue(1, intl.formatMessage({id: "forms.IncomeHousingForm.fields.homeMonthlyRent.error"}))
              ]
            )}
          />
        </Condition>
        <Condition when="homeRentOrOwn" is={OWNERSHIP_TYPES.own}>
          <WhenFieldChanges field="homeIsFullyOwnedNoMortgage" becomes={true} set="homeMonthlyRentMortgage" to={undefined} />
          <FormField
            name="homeMonthlyRentMortgage"
            disabled={values.homeIsFullyOwnedNoMortgage === true}
            data={{
              allowDecimals: false,
              allowNegativeValue: false,
              disableAbbreviations: true,
              intlConfig: { locale: intl.locale, currency: "USD" },
              label: intl.formatMessage({
                id: "forms.IncomeHousingForm.fields.homeMonthlyMortgage.label",
              }),
              maxLength: 12,
              required: !values.homeIsFullyOwnedNoMortgage,
              name: "homeMonthlyRentMortgage",
              type: FIELD_TYPES.currency,
            }}
            validate={(value, allValues) => {
              return allValues.homeIsFullyOwnedNoMortgage
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
                        id: "forms.IncomeHousingForm.fields.homeMonthlyMortgage.error",
                      })
                    ),
                    Validators.minValue(1, intl.formatMessage({id: "forms.IncomeHousingForm.fields.homeMonthlyMortgage.error"}))
                  ]
                )(value)
            }}
          />
          <div className="fortifid-income-housing__checkbox">
            <FormField
              name="homeIsFullyOwnedNoMortgage"
              required
              data={{
                required: true,
                name: "homeIsFullyOwnedNoMortgage",
                type: FIELD_TYPES.checkbox,
                label: intl.formatMessage({
                  id: "forms.IncomeHousingForm.fields.homeIsFullyOwnedNoMortgage.label",
                }),
              }}
            />
          </div>
        </Condition>
        <Condition when="homeRentOrOwn" is={OWNERSHIP_TYPES.other}>
          <FormField
            name="homeAdditionalDetails"
            data={{
              required: true,
              name: "homeAdditionalDetails",
              type: "textarea",
              label: intl.formatMessage({
                id: "forms.IncomeHousingForm.fields.homeAdditionalDetails.label",
              }),
              maxLength: 1000,
            }}
            validate={composeValidators(...[Validators.required(intl.formatMessage({ id: "formErrors.requiredField" }))])}
          />
        </Condition>
      </FormFieldsWrapper>
    )
  }
}

class IncomeHousingForm extends Component {
  submit = async values => {
    values = processIncomeHousingDetails(values);
    let { homeRentOrOwn, homeMonthlyRentMortgage, homeIsFullyOwnedNoMortgage, homeAdditionalDetails } = values;
    this.props.onSubmit({ homeRentOrOwn, homeMonthlyRentMortgage, homeIsFullyOwnedNoMortgage, homeAdditionalDetails })
  }

  componentDidMount() {
    const firstNameField = document.getElementById("homeMonthlyRentMortgage");
    if (firstNameField) {
      firstNameField.focus();
    }
  }

  render() {
    let {
      intl,
      individualData: { homeRentOrOwn, homeMonthlyRentMortgage, homeAdditionalDetails, homeIsFullyOwnedNoMortgage },
      settings: { submitDisabled },
    } = this.props;
    homeIsFullyOwnedNoMortgage = Boolean(homeIsFullyOwnedNoMortgage);

    return (
      <div className="fortifid-income-housing">
        <PageHeading title={<FormattedMessage id="forms.IncomeHousingForm.title" />} />
        <Form
          initialValues={{
            homeRentOrOwn,
            homeMonthlyRentMortgage,
            homeIsFullyOwnedNoMortgage,
            homeAdditionalDetails,
          }}
          onSubmit={this.submit}
          render={({ handleSubmit, submitting, values }) => (
            <form onSubmit={handleSubmit}>
              <IncomeHousingFormFields data={{intl, values}}/>
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
}))(injectIntl(IncomeHousingForm))
