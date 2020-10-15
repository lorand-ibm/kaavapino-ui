// Field returns info whether field given as a parameter should be shown or not.
export const showField = (field, formValues) => {
  let returnValue = false
  if (field && field.visibility_conditions && field.visibility_conditions.length > 0) {
    field.visibility_conditions.forEach(visibilityCondition => {

      const variable = visibilityCondition.variable
      const operator = visibilityCondition.operator
      const comparisonValue = visibilityCondition.comparison_value
      const comparisonValueType = visibilityCondition.comparison_value_type

      if ( comparisonValueType === 'list<string>' ) {
        if ( comparisonValue.includes(formValues[variable])) {
          returnValue = true
          return
        }
      }

      if (comparisonValueType === 'boolean') {
        const value = formValues[variable]
        let realValue = false

        if ( value === true || value === false ) {
         realValue = value
        } else {
          realValue = value !== undefined ? true : false
        }
        if (operator === '==' && comparisonValue === realValue) {
          returnValue = true
          return
        }
        if (operator === '!=' &&  comparisonValue !== realValue) {
          returnValue = true
          return
        }

      }
      if (comparisonValueType === 'string' || comparisonValueType === 'number' ) {
        if (operator === '==' && comparisonValue === formValues[variable]) {
          returnValue = true
          return
        }
        if (operator === '!=' &&  comparisonValue !== formValues[variable]) {
          returnValue = true
          return
        }
      }
    })
  } else {
    returnValue = true
  }
  return returnValue
}