import React from 'react'
import Geometry from '../input/Geometry'

const Summary = ({ attributeData }) => {
  const formatAttributeValue = ({ type, value, empty }) => {
    if (empty) {
      return <p>-</p>
    }
    if (type === 'boolean') {
      return <p>{value ? 'Kyllä' : 'Ei'}</p>
    } else if (type === 'fieldset') {
      return (
        <div>
          { value.map((set, i) => (
            <React.Fragment key={i}>
              { Object.values(set).map((field) => (
                <p key={field}>{ field }</p>
              )) }
            </React.Fragment>
          )) }
        </div>
      )
    } else if (type === 'matrix') {
      return <p>Ei tuettu</p>
    } else if (type === 'geometry') {
      return <Geometry disabled input={{ value }} />
    }

    return <p>{value}</p>
  }
  return (
    <div className='summary'>
      { attributeData.map(({ label, ...rest }) => {
        return (
          <div key={label}>
            <b>{ label }</b>
            { formatAttributeValue(rest) }
          </div>
        )
      }) }
    </div>
  )
}

export default Summary