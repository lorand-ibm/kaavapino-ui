import projectUtils from './projectUtils'
//import { isArray } from 'lodash'
//import toPlaintext from 'quill-delta-to-plaintext'

/* Field returns info whether field given as a parameter should be shown or not.
 *
 *  Autofill_rule has variables property which is meant to add a value from form to
 *  rule. Now it is only implemented if type is boolean and expected return value is string.
 *  Eq. "Kaavan nimi"-rule which has project name at the beginning and "asemakaava" or "asemakaava ja asemakaavan muuttaminen"
 */
export const getFieldAutofillValue = (autofill_rule, formValues) => {
  let returnValue
  let projectNameAdded = false
  const EQUAL = '=='
  const NOT_EQUAL = '!='
  const TRUE_STRING = 'True'
  const FALSE_STRING = 'False'
  const BIGGER_THAN = '>'

  if (autofill_rule && autofill_rule.length > 0) {
    autofill_rule.forEach(autofill => {
      const condition = autofill.condition
      const thenBranch = autofill.then_branch

      if (!condition || (!thenBranch && thenBranch !== '')) {
        return ''
      }
      const variable = condition.variable
      const operator = condition.operator
      const comparisonValue = condition.comparison_value
      const comparisonValueType = condition.comparison_value_type
      const extraVariables = autofill.variables

      let formValue =
        formValues[variable] === undefined
          ? projectUtils.findValueFromObject(formValues, variable)
          : formValues[variable]

      // Now only one variable is expected
      let formExtraValue = extraVariables
        ? projectUtils.findValueFromObject(formValues, extraVariables[0])
        : ''

      if (!formExtraValue) {
        formExtraValue = ''
      }

      // List rule
      if (comparisonValueType === 'list<string>') {
        if (comparisonValue.includes(formValue)) {
          if (thenBranch === TRUE_STRING) {
            returnValue = true
            return
          }
          if (thenBranch === FALSE_STRING) {
            returnValue = false
            return
          }
          returnValue = thenBranch
          return
        }
      }
      // Boolean type
      if (comparisonValueType === 'boolean') {

        const realValue = formValue ? formValue === true : false

      /*  const richTextValue = formValue && formValue.ops ? toPlaintext( formValue.ops ) : undefined

        const richTextHasValue = richTextValue && richTextValue.trim() !== '' ? true : false

        const realValue = formValue && !formValue.ops || richTextHasValue ? true : false
*/
        if (operator === EQUAL && comparisonValue === realValue) {
          if (thenBranch === TRUE_STRING) {
            returnValue = true
            return
          } else if (thenBranch === 'False') {
            returnValue = false
            return
          } else {
            if (returnValue) {
              if (formExtraValue && !projectNameAdded) {
                returnValue = `${formExtraValue} ${returnValue} ${thenBranch}`
                projectNameAdded = true
              } else {
                returnValue = `${returnValue} ${thenBranch}`
              }
            } else {
              if (!projectNameAdded) {
                returnValue = `${formExtraValue} ${thenBranch}`
                projectNameAdded = true
              } else {
                returnValue = thenBranch
              }
            }
          }
        } else {
          if (extraVariables && !projectNameAdded) {
            returnValue = formExtraValue
            projectNameAdded = true
          }
        }
        if (operator === NOT_EQUAL && comparisonValue !== realValue) {
          if (thenBranch === TRUE_STRING) {
            returnValue = true
            return
          } else if (thenBranch === FALSE_STRING) {
            returnValue = false
            return
          } else {
            if (returnValue) {
              returnValue = `${returnValue} ${thenBranch}`
            } else {
              returnValue = thenBranch
            }
          }
        }
      }
      if (comparisonValueType === 'number' || comparisonValueType === 'string') {
        const thenFormValue =
        formValues[thenBranch] === undefined
          ? projectUtils.findValueFromObject(formValues, thenBranch)
          : formValues[thenBranch]

        if ( !formValue && formValue !== false && formValue !== '' ) {
          returnValue = false
          return
        }
        if (operator === EQUAL && comparisonValue === formValue) {

          returnValue = thenFormValue|| thenBranch
          return
        }
        if (operator === NOT_EQUAL && comparisonValue !== formValue) {
          returnValue = thenFormValue || thenBranch
          return
        }
        if (operator === BIGGER_THAN && formValue > comparisonValue) {
          if (thenBranch === 'True') {
            returnValue = true
          } else {
            returnValue =  thenFormValue || thenBranch
          }
          return
        }
        if (operator === BIGGER_THAN && formValue <= comparisonValue) {
          returnValue = false
          return
        }
      }
    })
  }
  return returnValue
}
