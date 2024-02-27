import React from "react"
import { Field } from "react-final-form"
import MailCheck from "react-mailcheck"
import formatStringByPattern from "format-string-by-pattern"

import {
  CheckBoxInput,
  CurrencyInput,
  NumberInput,
  RadioImageInput,
  RadioInput,
  SelectInput,
  TextArea,
  TextInput,
  CheckboxGroup,
} from "components/Shared/Form/FormInput/FormInput"
import {} from "../FormInput/FormInput"
import { rectifyCaretPositionInMaskedOrFormattedField } from "../../helpers"

const parseNumber = value => {
  if (!value) {
    return value
  }
  return value.replace(/[^\d]/g, "")
}

const FieldWrapper = ({ children, ...rest }) => (
  <Field {...rest}>
    {({ input, meta }) => {
      const error = meta.touched && (meta.error || (meta.submitError && !meta.dirtySinceLastSubmit && !meta.submitting))
      const message =
        meta.touched &&
        (meta.error || (meta.submitError && !meta.dirtySinceLastSubmit && !meta.submitting)) &&
        (meta.error || meta.submitError)

      return children({ input, meta, error, message })
    }}
  </Field>
)

export const CheckBoxField = ({ data, validate, ...props }) => (
  <FieldWrapper name={data.name} type={data.type} validate={validate} {...props}>
    {({ input, error, message }) => (
      <CheckBoxInput data={data} error={error} input={input} message={message} required={data.required} type={data.type} />
    )}
  </FieldWrapper>
)

export const CurrencyField = ({ data, validate, ...props }) => (
  <FieldWrapper name={data.name} validate={validate} {...props}>
    {({ input, error, message }) => (
      <CurrencyInput data={data} disabled={props.disabled} error={error} input={input} message={message} required={data.required} />
    )}
  </FieldWrapper>
)

export const EmailField = ({ data, validate, suggestion, ...props }) => {
  let suggestionFunc
  if (suggestion) {
    if (typeof suggestion === "string") {
      suggestionFunc = value => suggestion
    } else {
      suggestionFunc = suggestion
    }
  } else {
    suggestionFunc = value => `Did you mean "${value.full}"?`
  }
  return (
    <Field name={data.name} validate={validate} {...props}>
      {({ input, meta }) => (
        <MailCheck email={input.value}>
          {suggestionValue => (
            <TextInput
              data={data}
              error={meta.touched && meta.error}
              empty={!input.value || input.value.length === 0}
              input={input}
              message={meta.touched && (meta.error || suggestionValue) ? meta.error || suggestionFunc(suggestionValue) : ""}
              required={data.required}
              type="email"
            />
          )}
        </MailCheck>
      )}
    </Field>
  )
}

export const NumberField = ({ data, validate, ...props }) => (
  <FieldWrapper
    name={data.name}
    validate={validate}
    parse={value =>
      value
        ? value
            .replace(/\D+/g, "")
            .replace(/^0+(\d+)$/, "$1")
            .slice(0, 65)
        : value
    }
    {...props}
  >
    {({ input, error, message }) => (
      <NumberInput
        data={data}
        disabled={props.disabled}
        error={error}
        empty={!input.value || input.value.length === 0}
        input={input}
        message={message}
        required={data.required}
        type="text"
      />
    )}
  </FieldWrapper>
)

export const GenericTextField = ({ key, data, validate, ...props }) => (
  <FieldWrapper key={key} name={data.name} validate={validate} {...props}>
    {({ input, error, message }) => (
      <TextInput
        data={data}
        disabled={props.disabled}
        error={error}
        empty={!input.value || input.value.length === 0}
        input={{
          ...input,
          onChange: e => {
            input.onChange(e);
            if (data.format) rectifyCaretPositionInMaskedOrFormattedField(e);
          }
        }}
        message={message}
        required={data.required}
        type={data.type}
      />
    )}
  </FieldWrapper>
)

// eslint-disable-next-line no-unused-vars
export const RadioField = ({ className, data, validate, ...rest }) => (
  <FieldWrapper name={data.name} validate={validate} {...rest}>
    {({ input, error, message }) => (
      <RadioInput
        className={className}
        data={data}
        error={error}
        input={input}
        message={message}
        required={data.required}
        type={data.type}
      />
    )}
  </FieldWrapper>
)

// eslint-disable-next-line no-unused-vars
export const RadioImageField = ({ className, data, ...rest }) => (
  <FieldWrapper name={data.name} {...rest}>
    {({ input, error, message }) => (
      <RadioImageInput
        className={className}
        data={data}
        error={error}
        message={message}
        input={input}
        required={data.required}
        type={FIELD_TYPES.radio}
      />
    )}
  </FieldWrapper>
)

export const SelectField = ({ data, validate, ...props }) => (
  <FieldWrapper name={data.name} validate={validate} {...props}>
    {({ input, error, message }) => (
      <SelectInput
        data={data}
        error={error}
        input={input}
        message={message}
        disabled={props.disabled}
        isSearchable={props.isSearchable}
        required={data.required}
        
        // onChange={props.onChange}
        // onSelect={props.onSelect}

      />
    )}
  </FieldWrapper>
)

export const TextAreaField = ({ data, validate, ...props }) => (
  <FieldWrapper name={data.name} validate={validate} {...props}>
    {({ input, error, message }) => (
      <TextArea
        data={data}
        error={error}
        input={input}
        empty={!input.value || input.value.length === 0}
        message={message}
        required={data.required}
      />
    )}
  </FieldWrapper>
)

export const FormattedDateField = ({ data, ...props }) => (
  <GenericTextField data={data} {...props} type="tel" parse={value => formatStringByPattern(data.format, parseNumber(value))} />
)

export const MaskedField = ({ data, maskStr = "*", maskRegex = /([\d])(?=([\d\s-]){4})/g, pattern = "123-45-6789", ...props }) => {
  const parse = value => {
    return value && pattern ? formatStringByPattern(pattern, value) : value
  }

  const mask = value => {
    return value && value.replace(maskRegex, maskStr)
  }
  const isMasked = value => {
    return value && isNaN(value.charAt(0))
  }

  return (
    <FieldWrapper name={data.name} type="tel" format={parse} parse={parse} {...props}>
      {({ input, meta, error, message }) => (
        <TextInput
          data={data}
          disabled={props.disabled}
          error={error}
          empty={!input.value || input.value.length === 0}
          input={{
            ...input,
            value: meta.active ? input.value : mask(input.value),
            onFocus: e => {
              if (isMasked(input.value)) {
                input.onChange("")
              }
              input.onFocus(e)
            },
            onChange: e => {
              input.onChange(e);
              rectifyCaretPositionInMaskedOrFormattedField(e);
            }
          }}
          message={message}
          required={data.required}
          type={data.type}
        />
      )}
    </FieldWrapper>
  )
}

export const PhoneField = ({ data, ...props }) => (
  <GenericTextField
    data={data}
    {...props}
    type="tel"
    parse={value => {
      return formatStringByPattern(data.format, parseNumber(value))
    }}
  />
)

export const MultiCheckField = ({ data, disabled, ...props }) => (
  <FieldWrapper {...props}>
    {({ input, error, message }) => {
      return (
        <CheckboxGroup
          data={data}
          input={input}
          disabled={disabled}
          error={error}
          message={message}
          required={data.required}
          type={data.type}
        />
      )
    }}
  </FieldWrapper>
)

export const FIELD_TYPES = {
  checkbox: "checkbox",
  currency: "currency",
  email: "email",
  formatted_date: "formatted_date",
  masked: "masked",
  multicheck: "multicheck",
  number: "number",
  password: "password",
  phone: "phone",
  radio: "radio",
  radioimage: "radioimage",
  select: "select",
  tel: "tel",
  text: "text",
  textarea: "textarea",
  zip: "zip",
}

const FormField = ({ data, ...props }) => {
  switch (data.type) {
    case FIELD_TYPES.checkbox:
      return <CheckBoxField data={data} {...props} />
    case FIELD_TYPES.currency:
      return <CurrencyField data={data} {...props} />
    case FIELD_TYPES.email:
      return <EmailField data={data} {...props} />
    case FIELD_TYPES.formatted_date:
      return <FormattedDateField data={data} {...props} />
    case FIELD_TYPES.masked:
      return <MaskedField data={data} {...props} />
    case FIELD_TYPES.multicheck:
      return <MultiCheckField data={data} {...props} />
    case FIELD_TYPES.number:
      return <NumberField data={data} {...props} />
    case FIELD_TYPES.phone:
      return <PhoneField data={data} {...props} />
    case FIELD_TYPES.radio:
      return <RadioField data={data} {...props} />
    case FIELD_TYPES.radioimage:
      return <RadioImageField data={data} {...props} />
    case FIELD_TYPES.select:
      return <SelectField data={data} {...props} />
    case FIELD_TYPES.textarea:
      return <TextAreaField data={data} {...props} />
    default:
      return <GenericTextField data={data} {...props} />
  }
}

export default FormField
