import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { reduxForm } from 'redux-form'
import FormSection from './FormSection'
import FormButton from '../common/FormButton'
import { EDIT_PROJECT_FORM } from '../../constants'
import Shoutbox from '../shoutbox'
import {Button, IconArrowUp } from 'hds-react'

class EditForm extends Component {
  componentDidMount() {
    this.autoSave = setInterval(() => this.props.handleSave(), 180000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
    clearInterval(this.autoSave)
  }

  componentDidUpdate(prevProps) {
    const { saving, initialize, attributeData, geoServerData, submitErrors, initialized } = this.props

    if (
      prevProps.saving &&
      !saving &&
      !submitErrors &&
      Object.keys(submitErrors).length > 0
    ) {
      const newInitialize = Object.assign(attributeData, geoServerData )
      
      initialize( newInitialize )
    }
    if ( initialized !== prevProps.initialized ) {
      this.props.setFormInitialized(true)
    }

  }

  render() {
    const {
      disabled,
      sections,
      title,
      projectId,
      showEditFloorAreaForm,
      showEditProjectTimetableForm,
      attributeData,
      syncronousErrors,
      submitErrors,
      showCreate
    } = this.props
    
    return (
      <Form className="form-container" autoComplete="off">
        <h2 id="accordion-title">{title}</h2>
        <div className="edit-form-buttons">
          {showCreate && (
            <FormButton
              value="Päivitä aikataulu"
              variant='secondary'
              onClick={showEditProjectTimetableForm}
            />
          )}
          {showCreate && (
            <FormButton
              value="Päivitä kerrosalatiedot"
              variant='secondary'
              onClick={showEditFloorAreaForm}
            />
          )}
          <Shoutbox project={projectId} />
        </div>
        {sections.map((section, i) => (
          <FormSection
            syncronousErrors={syncronousErrors}
            submitErrors={submitErrors}
            formName={EDIT_PROJECT_FORM}
            key={i}
            handleSave={this.props.handleSave}
            section={section}
            disabled={disabled}
            attributeData={attributeData}
            setRef={ this.props.setRef }
          />
        ))}
        <Button variant="supplementary"
          iconRight={<IconArrowUp/>}
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div>Sivun alkuun</div>
        </Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: EDIT_PROJECT_FORM,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(EditForm)
