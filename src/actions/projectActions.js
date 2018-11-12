export const FETCH_PROJECTS = 'Fetch projects'
export const FETCH_PROJECTS_SUCCESSFUL = 'Fetch projects successful'
export const CREATE_PROJECT = 'Create project'
export const CREATE_PROJECT_SUCCESSFUL = 'Create project successful'
export const FETCH_PROJECT_SUCCESSFUL = 'Fetch project successful'
export const INITIALIZE_PROJECT = 'Initialize project'
export const INITIALIZE_PROJECT_SUCCESSFUL = 'Initialize project successful'
export const SAVE_PROJECT = 'Save project'
export const SAVE_PROJECT_SUCCESSFUL = 'Save project successful'
export const VALIDATE_PROJECT_FIELDS = 'Validate project fields'
export const VALIDATE_PROJECT_FIELDS_SUCCESSFUL = 'Validate project fields successful'
export const CHANGE_PROJECT_PHASE = 'Change phase'
export const CHANGE_PROJECT_PHASE_SUCCESSFUL = 'Change phase successful'
export const CHANGE_PROJECT_PHASE_FAILURE = 'Change phase failure'

export const fetchProjects = () => ({ type: FETCH_PROJECTS })
export const fetchProjectsSuccessful = (projects) => ({ type: FETCH_PROJECTS_SUCCESSFUL, payload: projects })

export const initializeProject = (id) => ({ type: INITIALIZE_PROJECT, payload: id })
export const initializeProjectSuccessful = () => ({ type: INITIALIZE_PROJECT_SUCCESSFUL })

export const fetchProjectSuccessful = (project) => ({ type: FETCH_PROJECT_SUCCESSFUL, payload: project })

export const createProject = () => ({ type: CREATE_PROJECT })
export const createProjectSuccessful = (project) => ({ type: CREATE_PROJECT_SUCCESSFUL, payload: project })

export const saveProject = () => ({ type: SAVE_PROJECT })
export const saveProjectSuccessful = () => ({ type: SAVE_PROJECT_SUCCESSFUL })

export const validateProjectFields = () => ({ type: VALIDATE_PROJECT_FIELDS })
export const validateProjectFieldsSuccessful = (result) => ({ type: VALIDATE_PROJECT_FIELDS_SUCCESSFUL, payload: result })

export const changeProjectPhase = (nextPhase) => ({ type: CHANGE_PROJECT_PHASE, payload: nextPhase })
export const changeProjectPhaseSuccessful = (updatedProject) => ({
  type: CHANGE_PROJECT_PHASE_SUCCESSFUL,
  payload: updatedProject
})
export const changeProjectPhaseFailure = () => ({ type: CHANGE_PROJECT_PHASE_FAILURE })
