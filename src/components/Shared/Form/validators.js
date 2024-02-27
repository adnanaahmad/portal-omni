import moment from "moment"
import validator from "validator"
import { isValidNumber } from "libphonenumber-js"

import { isDLNValidExt, ValidationRegex as regex } from "validators"

// generic validator
export const textRegex = (message, validator) => value =>
  value && (!value.trim() || !validator.test(value)) ? message || "Invalid field value" : undefined

export const jobTitle = message => textRegex(message || "Job title contains invalid characters", regex.REGEX_EMPLOYMENT_JOB_TITLE)

export const employerName = message =>
  textRegex(message || "Employer name contains invalid characters", regex.REGEX_EMPLOYMENT_EMPLOYER_NAME)

export const name = message => textRegex(message || "Invalid field value", regex.REGEX_NAME)

export const bankName = message => textRegex(message || "Invalid bank name", regex.REGEX_BANK_NAME)

export const companyName = message => textRegex(message || "Invalid company name", regex.REGEX_COMPANY_NAME)

export const addressCity = message => textRegex(message || "Invalid city name", regex.REGEX_ADDRESS_CITY)

export const addressZip = message => textRegex(message || "Invalid zip code", regex.REGEX_ADDRESS_ZIP)

export const addressStreet = message => textRegex(message || "Invalid street name", regex.REGEX_ADDRESS_STREET)

export const addressAptSuiteNumber = message => textRegex(message || "Invalid suite number", regex.REGEX_ADDRESS_APT_SUITE_NUMBER)

export const boolean = message => value => !!value === value ? undefined : message || "Invalid value"

export const dba = message => textRegex(message || "Invalid value", regex.REGEX_DOING_BUSINESS_AS)

export const date =
  (message, format, from, to, inclusivity = "[]") =>
  value => {
    const parsed = moment(value, format, true)
    return parsed.isValid()? undefined : message || "Invalid date"
  }

export const dln = (message, stateField) => (value, allValues) =>
  value && !isDLNValidExt(value, allValues[stateField]) ? message || "Must be a valid driver's license number" : undefined

export const ein = message => textRegex(message || "Invalid EIN", regex.REGEX_EIN)

export const email = message => value => value && !validator.isEmail(value) ? message || "Invalid email address" : undefined

export const number = message => value => value && !validator.isNumeric(value) ? message || "Must be a number" : undefined

export const phone = (message, country_code = "US") => {
  return value => (value && !isValidNumber(value, country_code) ? message || "Invalid phone number" : undefined)
}

export const required = message => {
  return value => {
    const retVal = message || "This field is required"
    if (value) {
      if (Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return retVal
      }
      return undefined
    }
    return retVal
  }
}

export const ssn = message => textRegex(message || "Invalid SSN", regex.REGEX_SSN)

export const text = message => textRegex(message || "Can contain letters, digits, spaces and symbols (- . , ' \\ /)", regex.REGEX_TEXT)

export const website = message => value =>
  value &&
  !validator.isURL(value, {
    protocols: ["http", "https"],
  })
    ? message || "Invalid website URL"
    : undefined

export const  minValue = (min, message) => value =>isNaN(value) || value >= min ? undefined : message;

export const  maxValue = (max, message) => value =>isNaN(value) || value <= max ? undefined : message;

export const dob = (message, format) =>
  value => {
    const parsed = moment(value, format, true);
    const age = moment().diff(moment(parsed), 'years');
    return (parsed.isValid() && age >= 18 && age <= 100) ? undefined : message || "Invalid date"
}

export const dateRange = (message, format, from, to) =>
  value => {
    const parsed = moment(value, format, true);
    const withinBounds = (from.diff(moment(parsed)) <= 0) && (to.diff(moment(parsed)) >= 0);
    return (parsed.isValid() && withinBounds) ? undefined : message || "Invalid date"
}

export const composeValidators =
  (...validators) =>
  (value, allValues, meta) =>
    validators.reduce((error, validator) => error || validator(value, allValues, meta), undefined)

export const Validators = {
  addressAptSuiteNumber,
  addressCity,
  addressStreet,
  addressZip,
  bankName,
  boolean,
  companyName,
  date,
  dba,
  dln,
  ein,
  email,
  employerName,
  jobTitle,
  name,
  number,
  phone,
  required,
  ssn,
  text,
  textRegex,
  website,
  minValue,
  maxValue,
  dob,
  dateRange
}

export default Validators
