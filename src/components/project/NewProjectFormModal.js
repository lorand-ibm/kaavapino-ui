import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Form } from 'semantic-ui-react'
import { reduxForm, getFormSubmitErrors, getFormValues } from 'redux-form'
import projectUtils from '../../utils/projectUtils'
import './NewProjectFormModal.scss'
import { connect } from 'react-redux'
import { NEW_PROJECT_FORM } from '../../constants'
import { newProjectSubtypeSelector } from '../../selectors/formSelector'
import FormField from '../input/FormField'
import { usersSelector } from '../../selectors/userSelector'

const PROJECT_NAME = 'name'
const USER = 'user'
const PUBLIC = 'public'
const SUB_TYPE = 'subtype'
const CREATE_PRINCIPLES = 'create_principles'
const CREATE_DRAFT = 'create_draft'

class NewProjectFormModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.submitting && this.props.submitSucceeded) {
      this.handleClose()
    } else if (
      prevProps.submitting &&
      this.props.submitFailed &&
      !this.props.submitSucceeded &&
      this.state.loading
    ) {
      this.setState({ loading: false })
    }
  }

  formatUsers = () => {
    return this.props.users.map(user => {
      return {
        value: user.id,
        label: projectUtils.formatUsersName(user)
      }
    })
  }

  handleSubmit = () => {
    this.setState({ loading: true })
    const errors = this.props.handleSubmit()
    console.log(errors)
  }

  handleClose = () => {
    this.props.reset()
    this.props.handleClose()
    this.setState({ loading: false })
  }
  getError = (errorObject, fieldName ) => {

    if  (errorObject) {
       if ( fieldName === USER ) {
         return errorObject.user
       }
    }
    return errorObject

  }

  getFormField = ( fieldProps )  => {
    const { formSubmitErrors } = this.props

    const errorObject =
      formSubmitErrors &&
      fieldProps &&
      fieldProps.field &&
      formSubmitErrors[fieldProps.field.name]

    return <FormField {...fieldProps} error={this.getError( errorObject, fieldProps.field.name) } />
  }

  render() {
    const { loading } = this.state
    const { currentProject, selectedSubType, initialValues, formValues } = this.props
    const showXLProjectOptions = selectedSubType === 5
    const isEdit = !!currentProject

    // Decision 22.9 that updating project size is not allowed in phase 1 and it is now disabled.
    return (
      <Modal
        className="form-modal"
        size={'small'}
        onClose={this.props.handleClose}
        open={this.props.open}
        closeIcon
      >
        <Modal.Header> {isEdit ? 'Muokkaa luontitietoja' : 'Luo uusi projekti'}</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              {this.getFormField({
                field: {
                  name: PROJECT_NAME,
                  label: 'Projektin nimi',
                  type: 'text'
                }
              })}
              {this.getFormField({
                className: 'ui fluid input',
                field: {
                  name: USER,
                  label: 'Vastuuhenkilö',
                  type: 'select',
                  choices: this.formatUsers()
                }
              })}
            </Form.Group>
            {this.getFormField({
              field: {
                name: PUBLIC,
                label: 'Luodaanko projekti näkyväksi',
                type: 'boolean'
              },
              double: true
            })}
            {formValues && formValues.public && !initialValues.public && (
              <div className="warning-box">
                Huom. Aiemmin ei-näkyväksi merkityn projektin tiedot muuttuvat näkyviksi
                kaikille Kaavapinon käyttäjille.
              </div>
            )}
            <div className="subtype-input-container">
              {this.getFormField({
                field: {
                  name: SUB_TYPE,
                  label: 'Valitse prosessin koko',
                  type: 'radio',
                  disabled: isEdit,
                  options: [
                    { value: 1, label: 'XS' },
                    { value: 2, label: 'S' },
                    { value: 3, label: 'M' },
                    { value: 4, label: 'L' },
                    { value: 5, label: 'XL' }
                  ]
                }
              })}
            </div>
            {formValues &&
              initialValues.subtype &&
              formValues.subtype !== initialValues.subtype && (
                <div className="warning-box">
                  Huom. Kun prosessi vaihtuu, vain ne Kaavapinoon syötetyt tiedot jäävät
                  näkyviin, jotka kuuluvat valittuun prosessiin.
                </div>
              )}
            {showXLProjectOptions && (
              <>
                <h4>Valitse, laaditaanko</h4>
                {this.getFormField({
                  field: {
                    name: CREATE_PRINCIPLES,
                    label: 'Periaatteet',
                    type: 'toggle'
                  }
                })}
                {this.getFormField({
                  field: { name: CREATE_DRAFT, label: 'Kaavaluonnos', type: 'toggle' }
                })}
              </>
            )}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary disabled={loading} onClick={this.handleClose}>
            Peruuta
          </Button>
          <Button
            primary
            disabled={loading}
            loading={loading}
            type="submit"
            onClick={this.handleSubmit}
          >
            {isEdit ? 'Tallenna' : 'Luo projekti'}
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

NewProjectFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  selectedSubType: newProjectSubtypeSelector(state),
  formSubmitErrors: getFormSubmitErrors(NEW_PROJECT_FORM)(state),
  formValues: getFormValues(NEW_PROJECT_FORM)(state),
  users: usersSelector(state)
})

const decoratedForm = reduxForm({
  form: NEW_PROJECT_FORM,
  initialValues: { public: true }
})(NewProjectFormModal)

export default connect(mapStateToProps, () => ({}))(decoratedForm)
