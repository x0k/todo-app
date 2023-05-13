import { nanoid } from 'nanoid'

import { type Workspace, type WorkspaceId } from '@/shared/kernel'

import {
  type CreateWorkspace,
  type DeleteWorkspace,
  type IWorkspaceService,
  type UpdateWorkspace,
} from './core'

export class TestWorkspaceService implements IWorkspaceService {
  private readonly workspaces: Map<WorkspaceId, Workspace>

  constructor(initial: Workspace[]) {
    this.workspaces = new Map(
      initial.map((workspace) => [workspace.id, workspace])
    )
  }

  loadWorkspaces = async (): Promise<Map<WorkspaceId, Workspace>> =>
    this.workspaces

  loadWorkspace = async (id: WorkspaceId): Promise<Workspace> => {
    const workspace = this.workspaces.get(id)
    if (workspace === undefined) {
      throw new Error(`Workspace "${id}" not found`)
    }
    return workspace
  }

  createWorkspace = async ({
    title,
    backend,
  }: CreateWorkspace): Promise<Workspace> => {
    const workspace: Workspace = {
      id: nanoid() as WorkspaceId,
      title,
      backend,
    }
    this.workspaces.set(workspace.id, workspace)
    return workspace
  }

  updateWorkspace = async ({
    id,
    data,
  }: UpdateWorkspace): Promise<Workspace> => {
    const workspace = this.workspaces.get(id)
    if (workspace === undefined) {
      throw new Error(`Workspace "${id}" not found`)
    }
    const updatedWorkspace = {
      ...workspace,
      ...data,
    }
    this.workspaces.set(id, updatedWorkspace)
    return updatedWorkspace
  }

  deleteWorkspace = async ({ id }: DeleteWorkspace): Promise<void> => {
    this.workspaces.delete(id)
  }
}
