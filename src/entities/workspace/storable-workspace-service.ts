import { nanoid } from 'nanoid'

import {
  type BackendType,
  type Workspace,
  type WorkspaceId,
} from '@/shared/kernel'
import { type IAsyncStorageService } from '@/shared/lib/storage'

import {
  type CreateWorkspace,
  type DeleteWorkspace,
  type IWorkspaceBackendService,
  type IWorkspaceService,
  type UpdateWorkspace,
} from './core'

export class StorableWorkspaceService implements IWorkspaceService {
  constructor(
    private readonly storageService: IAsyncStorageService<
      Map<WorkspaceId, Workspace>
    >,
    private readonly workspaceBackendService: IWorkspaceBackendService
  ) {}

  exportWorkspace = async (id: WorkspaceId): Promise<string> => {
    const workspace = await this.loadWorkspace(id)
    const data = await this.workspaceBackendService.export(workspace)
    return JSON.stringify([workspace, data])
  }

  importWorkspace = async (input: string): Promise<Workspace<BackendType>> => {
    const [workspace, data] = JSON.parse(input)
    await this.workspaceBackendService.import(workspace, data)
    const workspaces = await this.storageService.load()
    workspaces.set(workspace.id, workspace)
    await this.storageService.save(workspaces)
    return workspace
  }

  loadWorkspaces = async (): Promise<Map<WorkspaceId, Workspace>> =>
    await this.storageService.load()

  loadWorkspace = async (id: WorkspaceId): Promise<Workspace> => {
    const workspace = (await this.loadWorkspaces()).get(id)
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
    const workspaces = await this.storageService.load()
    workspaces.set(workspace.id, workspace)
    await this.storageService.save(workspaces)
    return workspace
  }

  updateWorkspace = async ({
    id,
    data,
  }: UpdateWorkspace): Promise<Workspace> => {
    const workspaces = await this.loadWorkspaces()
    const workspace = workspaces.get(id)
    if (workspace === undefined) {
      throw new Error(`Workspace "${id}" not found`)
    }
    Object.assign(workspace, data)
    workspaces.set(id, workspace)
    await this.storageService.save(workspaces)
    return workspace
  }

  deleteWorkspace = async ({ id }: DeleteWorkspace): Promise<void> => {
    const workspaces = await this.loadWorkspaces()
    const workspace = workspaces.get(id)
    if (workspace === undefined) {
      throw new Error(`Workspace "${id}" not found`)
    }
    await this.workspaceBackendService.release(workspace)
    workspaces.delete(id)
    await this.storageService.save(workspaces)
  }
}
