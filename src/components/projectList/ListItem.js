import React from 'react'
import { Link } from 'react-router-dom'
import { Popup } from 'semantic-ui-react'
import ProjectTimeline from '../ProjectTimeline/ProjectTimeline'
import { IconPenLine, Button } from 'hds-react'
import { truncate } from 'lodash'

const MAX_PROJECT_NAME_LENGTH = 30
const Status = ({ color }) => {
  return (
    <span
      className="project-status"
      style={{
        backgroundColor: color,
        ...(color === '#ffffff' && { border: '1px solid' })
      }}
    />
  )
}

const ListItem = ({
  showGraph,
  isExpert,
  modifyProject,
  deadlines,
  onhold,
  item: {
    phaseName,
    phaseColor,
    name,
    id,
    subtype,
    modified_at,
    user,
    projectId,
    pino_number
  }
}) => {
  return (
    <div className="project-list-item-container">
      <div className="project-list-item">
        <span className="project-list-item-pino field-ellipsis center">
          {pino_number}
        </span>
        <span className="center field-ellipsis">{projectId}</span>
        <span className="project-list-item-name center field-ellipsis">
          <Popup
            trigger={
              <Link className="project-name" to={`/${id}`}>
                {truncate(name, { length: MAX_PROJECT_NAME_LENGTH })}
              </Link>
            }
            on="hover"
            content={name}
          />
        </span>
        <span className="project-list-item-phase center field-ellipsis">
          <Status color={phaseColor} /> {phaseName}
        </span>
        <span className="center field-ellipsis">{subtype}</span>
        <span className="center field-ellipsis">{modified_at}</span>
        <Popup
          trigger={<span className="field-ellipsis center">{user}</span>}
          on="hover"
          content={user}
        />
        <span className="project-list-button">
          {isExpert && (
            <Button
              aria-label="Muokkaa"
              className="project-list-button"
              value="modify"
              variant="supplementary"
              iconLeft={<IconPenLine />}
              onClick={() => modifyProject(id)}
            />
          )}
        </span>
      </div>
      {showGraph && (
        <div className="project-list-item-graph">
          <ProjectTimeline deadlines={deadlines} projectView={true} onhold={onhold} />
        </div>
      )}
    </div>
  )
}

export default ListItem
