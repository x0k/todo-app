import { Box } from '@mui/material'

import { TitledPanel } from '@/shared/components'

import { WorkspacesList } from '@/features/workspaces-list'

export function HomePage(): JSX.Element {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <TitledPanel title="Workspaces">
        <Box padding={2}>
          <WorkspacesList />
        </Box>
      </TitledPanel>
    </Box>
  )
}
