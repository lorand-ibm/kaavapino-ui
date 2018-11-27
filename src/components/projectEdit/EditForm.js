import React, { Component } from 'react'
import { connect } from 'react-redux'
import { checkingSelector } from '../../selectors/projectSelector'
import { Form } from 'semantic-ui-react'
import { reduxForm } from 'redux-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Message } from 'semantic-ui-react'
import FormSection from './FormSection'
import Button from '../common/Button'
import ConfirmModal from './ConfirmModal'

class EditForm extends Component {
  state = {
    endPhaseError: false,
    verifying: false
  }

  componentDidMount() {
    const { initialize, attributeData } = this.props
    initialize(attributeData)
    this.autoSave = setInterval(() => this.props.handleSave(), 180000)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
    clearInterval(this.autoSave)
  }

  componentDidUpdate(prevProps) {
    const { setChecking, hasErrors, saving, initialize, attributeData } = this.props
    if (prevProps.validating && !this.props.validating) {
      if (!hasErrors) {
        this.setState({ verifying: true, endPhaseError: false })
        setChecking(false)
      } else {
        this.setState({ endPhaseError: true })
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => this.setState({ endPhaseError: false }), 5000)
        setChecking(true)
      }
    }

    if (prevProps.saving && !saving) {
      initialize(attributeData)
    }
  }

  phaseCallback = (changePhase) => {
    if (changePhase) {
      this.props.changePhase()
    }
    this.setState({ verifying: false })
  }

  changePhase = () => this.props.validateProjectFields()

  render() {
    const {
      sections,
      saving,
      isCurrentPhase,
      changingPhase,
      checking,
      attributeData,
      validating
    } = this.props
    return (
      <Form className='form-container'>
        { sections.map((section, i) => <FormSection key={i} section={section} checking={checking} attributeData={attributeData} /> ) }
        <Button
          handleClick={this.props.handleSave}
          value='Tallenna'
          icon={<FontAwesomeIcon icon='check' />}
          loading={saving}
        />
        { isCurrentPhase && (
          <Button
            handleClick={this.changePhase}
            value='Lopeta vaihe'
            icon={<FontAwesomeIcon icon='forward' />}
            loading={changingPhase || validating}
          />
        )}
        <ConfirmModal callback={this.phaseCallback} open={this.state.verifying} />
        { this.state.endPhaseError && (
          <Message
            header='Vaihetta ei voida vielä lopettaa'
            content='Täytä puuttuvat kentät'
            color='yellow'
          />
        )}
      </Form>
    )
  }
}

const mapStateToProps = (state) => ({
  checking: checkingSelector(state)
})

export default connect(
  mapStateToProps
)(
  reduxForm({
    form: 'editForm',
    enableReinitialize: true
  })(EditForm)
)