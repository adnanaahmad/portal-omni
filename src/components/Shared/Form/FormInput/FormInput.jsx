import React from "react"
import CurrencyInputField from "react-currency-input-field"
import Select from "react-select"
import { Field } from "react-final-form"
import "./FormInput.scss"
import classnames from "classnames"
import Icon from "components/Shared/Icon/Icon"
// todo: classnames

const BaseInput = ({ children, className, data, disabled, empty, error, message, required }) => {
  return (
    <label
      className={`${className} ${!disabled && error ? "error" : ""} ${required ? "required" : ""} ${empty ? "empty" : ""} ${
        disabled ? "disabled" : ""
      }`}
    >
      {data.icon ? <img alt="" className="fortifid-input-icon" src={data.icon.file.url} /> : null}
      {data.label && (
        <span className="fortifid-input-label">
          <span>{data.label}</span>{data.required && data.type !== 'checkbox' &&  <span>{`${' '}*`}</span>}
        </span>
      )}
      {children}
      {!disabled && message && (
        <span className={error ? "fortifid-input-error" : "fortifid-input-message"} dangerouslySetInnerHTML={{ __html: message }} />
      )}
      {data.hint && <div className="fortifid-input-hint">{data.hint}</div>}
    </label>
  )
}

export const CheckBoxInput = ({ data, input, type, ...rest }) => (
  <BaseInput className={`fortifid-checkbox-input ${input.value === true || input.checked ? "checked" : ""}`} data={data} {...rest}>
    <input type={type} {...input} />
  </BaseInput>
)

export const CurrencyInput = ({ data, input, ...rest }) => (
  <BaseInput className={"fortifid-currency-input"} data={data} empty={!input.value} {...rest}>
    <CurrencyInputField
      id={data.name}
      allowDecimals={data.allowDecimals}
      allowNegativeValue={data.allowNegativeValue}
      disableAbbreviations={data.disableAbbreviations}
      disabled={rest.disabled}
      intlConfig={data.intlConfig}
      maxLength={data.maxLength}
      onFocus={input.onFocus}
      onBlur={input.onBlur}
      value={input.value}
      onValueChange={value => input.onChange(value)}
      placeholder={data.placeholder ? data.placeholder : ""}
      autoComplete="off"
    />
  </BaseInput>
)

export const NumberInput = ({ data, input, type, ...rest }) => (
  <BaseInput className={data.labelPosition === 'left' ? 'fortifid-text-input' : 'fortifid-number-input'} data={data} {...rest}>
    <input id={data.name} disabled={rest.disabled} maxLength={data.maxLength} type={type} {...input} autoComplete="off" name={undefined} />
  </BaseInput>
)

export const RadioImageInput = ({ className, data, input, type, required }) => (
  <div className={`fortifid-radio-image-group ${required ? "required" : ""} ${className ? className : ""}`}>
    {data.options.map((option, i) => (
      <label key={`${data.name}_${i}`} className={`fortifid-radio-image-input ${option.value === input.value ? "checked" : className}`}>
        <div className="fortifid-radio-image-input__icon">
          <img alt="" src={option.icon} />
        </div>
        <span className="fortifid-radio-image-input__label">{option.label}</span>
        <input {...input} type={type} value={option.value} onChange={() => input.onChange(option.value)} />
      </label>
    ))}
  </div>
)

export const RadioInput = ({ className, data, input, type, error, message, required }) => (
  <div className={`fortifid-radio-group ${error ? "error" : ""} ${required ? "required" : ""} ${className ? className : ""}`}>
    <div className={"fortifid-input-label"}>{data.label}</div>
    {data.hint && <div className="fortifid-input-hint">{data.hint}</div>}
    {message && (
      <span className={error ? "fortifid-input-error" : "fortifid-input-message"} dangerouslySetInnerHTML={{ __html: message }} />
    )}
    <ul className={data.style === "responsive" ? "responsive" : "horizontal"}>
      {data.options.map((option, i) => (
        <li key={`${data.name}_${i}`}>
          <label className={`fortifid-radio-input ${option.value === input.value ? "checked" : className}`}>
            <span className="fortifid-radio-input__label">
              <span>{option.label}</span>
            </span>
            <input {...input} type={type} value={option.value} onChange={() => input.onChange(option.value)} />
          </label>
        </li>
      ))}
    </ul>
  </div>
)

// eslint-disable-next-line no-unused-vars
export const SelectInput = ({ data, input, isSearchable, ...rest }) => (
  <BaseInput className={"fortifid-select-input"} data={data} {...rest} empty={!input.value}>
    <Select
      classNamePrefix="fortifid-select-input"
      isDisabled={rest.disabled}
      isSearchable={isSearchable}
      options={data.options}
      placeholder={data.placeholder ? data.placeholder : ""}
      {...input}
      value={data.options.find(el => el.value === input.value)}
      onChange={data => input.onChange(data.value)}
      styles={{
        dropdownIndicator: (provided, state) => ({
            ...provided,
            transform: state.selectProps.menuIsOpen && 'rotate(180deg)'
        })
    }}
    />
  </BaseInput>
)

// eslint-disable-next-line no-unused-vars
export const TextArea = ({ data, input, type, rows, ...rest }) => (
  <BaseInput className={"fortifid-text-area"} data={data} {...rest}>
    <textarea placeholder={data.placeholder ? data.placeholder : ""} rows={rows ? rows : "5"} {...input} />
  </BaseInput>
)

export const TextInput = ({ data, input, type, ...rest }) => (
  <BaseInput className={"fortifid-text-input"} data={data} {...rest}>
    <input
      id={data.name}
      disabled={rest.disabled}
      maxLength={data.maxLength}
      placeholder={data.placeholder ? data.placeholder : ""}
      type={type}
      {...input}
      autoComplete="off"
      autoSave="off"
      name={undefined}
    />
  </BaseInput>
)

export const CheckboxGroup = ({ className, data, disabled, input, error, required, message }) => {
  return (
    <div
      className={`fortifid-checkbox-group ${error ? "error" : ""} ${required ? "required" : ""} ${className ? className : ""} ${
        disabled ? "disabled" : ""
      }`}
    >
      <div className="fortifid-input-label">{data.label}</div>
      {data.hint && <div className="fortifid-input-hint">{data.hint}</div>}
      {message && (
        <span className={error ? "fortifid-input-error" : "fortifid-input-message"} dangerouslySetInnerHTML={{ __html: message }} />
      )}
      <ul className={classnames({ responsive: data.style === "responsive" })}>
        {data.options.map((option, i) => (
          <li key={`${data.name}_${i}`}>
            <Field name={data.name} type="checkbox" value={option.value} disabled={disabled}>
              {({ input }) => (
                <label
                  className={`fortifid-checkbox-input
                    ${input.checked ? "checked" : ""}
                    ${disabled ? "disabled" : ""}`}
                >
                  <span className="fortifid-checkbox-input__label">
                    <span>{option.label}</span>
                    {input.checked && <Icon className="fortifid-checkbox-input__icon" name="CheckMark" />}
                  </span>
                  <input type="checkbox" {...input} disabled={disabled} />
                </label>
              )}
            </Field>
          </li>
        ))}
      </ul>
    </div>
  )
}
