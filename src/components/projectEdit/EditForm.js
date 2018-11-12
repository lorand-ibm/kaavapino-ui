import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { reduxForm } from 'redux-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormSection from './FormSection'
import Button from '../common/Button'

class EditForm extends Component {
  componentDidMount() {
    const { initialize, attributeData } = this.props
    initialize(attributeData)
  }

  render() {
    const { sections, saving, isCurrentPhase, changingPhase } = this.props
    return (
      <Form className='form-container'>
        { sections.map((section, i) => <FormSection key={i} section={section} /> ) }
        <Button
          handleClick={this.props.handleSave}
          value='Tallenna'
          icon={<FontAwesomeIcon icon='check' />}
          loading={saving}
        />
        { isCurrentPhase && (
          <Button
            handleClick={this.props.changePhase}
            value='Lopeta vaihe'
            icon={<FontAwesomeIcon icon='forward' />}
            loading={changingPhase}
          />
        )}
      </Form>
    )
  }
}

export default reduxForm({
  form: 'editForm'
})(EditForm)