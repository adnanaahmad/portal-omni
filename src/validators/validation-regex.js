module.exports = {
  REGEX_NAME: /^([a-zA-Z\-']+\s)*[a-zA-Z\-']+?$/,
  // http://www.irs.gov/Businesses/Small-Businesses-&-Self-Employed/How-EINs-are-Assigned-and-Valid-EIN-Prefixes
  REGEX_EIN: /^(0[1-6]|1[0-6]|2[0-7]|[35]\d|[468][0-8]|7[1-7]|9[0-589])(-*)\d{7}$/,
  // made dashes optional in ssn, so it can accept plain number as well
  REGEX_SSN: /^(?!666|000|9\d{2})(\d{3}|\*{3})(-*)(?!00)(\d{2}|\*{2})(-*)(?!0{4})\d{4}$/,
  REGEX_TEXT: /^[\w-.,'\\/\s]$/i,
  REGEX_ADDRESS_CITY: /^[A-Za-z-\s]+$/,
  REGEX_ADDRESS_ZIP: /^\d{5}(-\d{4})?$/,
  REGEX_ADDRESS_ZIP_SANITIZED: /^(\d{5}|\d{9})$/,
  REGEX_ADDRESS_STREET: /^[A-Za-z0-9 -.]+$/,
  REGEX_ADDRESS_APT_SUITE_NUMBER: /^[A-Za-z0-9 -.]+$/,
  REGEX_COMPANY_NAME: /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9 |^,'~?!&$#@\-+/()]{2,}$/,
  REGEX_BANK_NAME: /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9 '~?!&$#@\-+/()]{2,}$/,
  REGEX_DOING_BUSINESS_AS: /^[A-Za-z0-9 -']+$/,
  REGEX_EMPLOYMENT_JOB_TITLE: /^[A-Za-z0-9 -.]+$/,
  REGEX_EMPLOYMENT_EMPLOYER_NAME: /^[A-Za-z0-9 -.]+$/,
}
