import { Button, Typography } from '@mui/material'
import { useStore, useUnit } from 'effector-react/scope.mjs'

import { Center } from '@/shared/components'
import { routes } from '@/shared/routes'

import { $workspaceId } from '@/entities/todo'

export interface ErrorMessageProps {
  message: React.ReactNode
  action?: React.ReactNode
}

export function ToHome(): JSX.Element {
  const openHome = useUnit(routes.home.open)
  return <Button onClick={openHome}>Back to home</Button>
}

export function ToWorkspace(): JSX.Element {
  const openWorkspace = useUnit(routes.workspace.index.open)
  const workspaceId = useStore($workspaceId)
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

export function ErrorMessage({
  message,
  action = <ToHome />,
}: ErrorMessageProps): JSX.Element {
  return (
    <Center>
      <Typography>{message}</Typography>
      {action}
    </Center>
  )
}
