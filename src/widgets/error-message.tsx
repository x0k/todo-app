import { Button, Typography } from '@mui/material'
import { useUnit } from 'effector-react/scope'

import { Center } from '@/shared/components'
import { type WorkspaceId } from '@/shared/kernel'
import { router, routes } from '@/shared/router'

export interface ErrorMessageProps {
  message: React.ReactNode
  action?: React.ReactNode
}

export function ToHome(): JSX.Element {
  const openHome = useUnit(routes.home.open)
  return <Button onClick={openHome}>Back to home</Button>
}

export interface ToWorkspaceProps {
  workspaceId: WorkspaceId
}

export function ToWorkspace({ workspaceId }: ToWorkspaceProps): JSX.Element {
  const openWorkspace = useUnit(routes.workspace.index.open)
  return (
    <Button
      onClick={() => {
        openWorkspace({ workspaceId })
      }}
    >
      Back to workspace
    </Button>
  )
}

export function Back(): JSX.Element {
  const back = useUnit(router.back)
  return <Button onClick={back}>Go back</Button>
}

export function ErrorMessage({
  message,
  action = <Back />,
}: ErrorMessageProps): JSX.Element {
  return (
    <Center>
      <Typography>{message}</Typography>
      {action}
    </Center>
  )
}
