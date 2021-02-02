/* This file includes inmplementation of editing floor area, but currently only with mock data */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Button } from 'semantic-ui-react'
import { reduxForm, getFormSubmitErrors, getFormValues } from 'redux-form'
import { connect } from 'react-redux'
import { EDIT_PROJECT_TIMETABLE_FORM } from '../../../constants'
import FormField from '../../input/FormField'
import Collapse from '../../common/collapse'
import './styles.scss'
import { deadlineSectionsSelector } from '../../../selectors/schemaSelector'
import { withTranslation } from 'react-i18next'
import { deadlinesSelector } from '../../../selectors/projectSelector'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class EditProjectTimeTableModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    const { initialize, attributeData } = this.props
    initialize(attributeData)
  }

  setLoadingFalse = () => {
    if (this.state.loading) {
      this.setState({ loading: false })
    }
  }

  componentDidUpdate(prevProps) {
    const {
      saving,
      initialize,
      attributeData,
      submitSucceeded,
      submitFailed
    } = this.props

    /* handle submit success / failure */

    if (prevProps.submitting && submitSucceeded) {
      this.handleClose()
    } else if (prevProps.submitting && submitFailed) {
      this.setLoadingFalse()
    }
    if (prevProps.saving && !saving) {
      initialize(attributeData)
    }
  }

  handleSubmit = () => {
    this.setState({ loading: true })
    const errors = this.props.handleSubmit()

    if (errors) {
      this.setState({ loading: false })
    }
    console.log(errors)
  }

  handleClose = () => {
    this.props.reset()
    this.props.handleClose()
  }

  getFormField(fieldProps, key) {
    const { formSubmitErrors, formValues, deadlines } = this.props
    const error =
      formSubmitErrors &&
      fieldProps &&
      formSubmitErrors &&
      formSubmitErrors[fieldProps.field.name]

    return (
      <div key={key}>
        <FormField
          {...fieldProps}
          formName={EDIT_PROJECT_TIMETABLE_FORM}
          attributeData={{}}
          deadlines={deadlines}
          error={error}
          formValues={formValues}
          className={error ? 'modal-field error-border' : 'modal-field'}
          isProjectTimetableEdit={true}
        />
        {error && <div className="field-error">{error}</div>}
      </div>
    )
  }
  getFormFields = (sections, sectionIndex) => {
    const formFields = []
    sections.forEach(subsection => {
      subsection.attributes.forEach((field, fieldIndex) => {
        formFields.push(this.getFormField({ field }, `${sectionIndex} - ${fieldIndex}`))
      })
    })
    return formFields
  }

  renderSection = (section, sectionIndex) => {
    const sections = section.sections
    return (
      <Collapse title={section.title} key={sectionIndex}>
        {this.getFormFields(sections, sectionIndex)}
      </Collapse>
    )
  }
  setLoading = loading => {
    this.setState({ loading })
  }

  render() {
    const { loading } = this.state
    const { open, formValues, deadlineSections, t } = this.props

    if (!formValues) {
      return null
    }

    return (
      <Modal
        className="form-modal edit-project-timetable-form-modal"
        size="small"
        onClose={this.handleClose}
        open={open}
        closeIcon
      >
        <Modal.Header>{t('deadlines.title')}</Modal.Header>
        <Modal.Content>
          <Form>
            {deadlineSections.map((section, sectionIndex) =>
              this.renderSection(section, sectionIndex)
            )}
          </Form>
          <div className="warning-box">
            <FontAwesomeIcon
              className="warning-icon"
              icon={faExclamationTriangle}
              size="sm"
            />
            {t('deadlines.warning')}
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary disabled={loading} onClick={this.handleClose}>
            {t('common.cancel')}
          </Button>
          <Button
            primary
            disabled={loading}
            loading={loading}
            type="submit"
            onClick={this.handleSubmit}
          >
            {t('common.save')}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

EditProjectTimeTableModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  formSubmitErrors: getFormSubmitErrors(EDIT_PROJECT_TIMETABLE_FORM)(state),
  deadlineSections: deadlineSectionsSelector(state),
  formValues: getFormValues(EDIT_PROJECT_TIMETABLE_FORM)(state),
  deadlines: deadlinesSelector(state)
})

const decoratedForm = reduxForm({
  form: EDIT_PROJECT_TIMETABLE_FORM
})(withTranslation()(EditProjectTimeTableModal))

export default connect(mapStateToProps)(decoratedForm)
