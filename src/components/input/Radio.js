import React from 'react'
import { Form, Radio } from 'semantic-ui-react'

const CustomRadio = ({ input: { value, name, ...rest }, meta: { error }, inverted, double, ...custom }) => {
  let checked = 'n'
  if (value === '' || value === null) {
    checked = '-'
  } else if (value) {
    checked = 'y'
  }
  return (
    <div className={`radio-input-container${inverted ? ' inverted' : ''}`}>
      <Form.Field>
        <Radio
          label='Kyllä'
          { ...custom }
          error={ error }
          name={ name }
          onChange={() => rest.onChange(true)}
          checked={ checked === 'y' }
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label='Ei'
          { ...custom }
          error={ error }
          name={ name }
          onChange={() => rest.onChange(false)}
          checked={ checked === 'n' }
        />
      </Form.Field>
      {!double && (
        <Radio
          label='Tieto puuttuu'
          { ...custom }
          error={ error }
          name={ name }
          onChange={() => rest.onChange(null)}
          checked={ checked === '-' }
        />
      )}
    </div>
  )
}

export default CustomRadio