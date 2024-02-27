import React from "react"
import { Field } from "react-final-form"
import { OnChange } from "react-final-form-listeners"

export const Condition = ({ when, is, condFunc, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => ((condFunc ? condFunc(value) : value === is) ? children : null)}
  </Field>
)

export const WhenFieldChanges = ({ field, becomes, set, to }) => (
  <Field name={set} subscription={{}}>
    {({ input: { onChange } }) => (
      <OnChange name={field}>
        {value => {
          if (value === becomes) onChange(to)
        }}
      </OnChange>
    )}
  </Field>
)
