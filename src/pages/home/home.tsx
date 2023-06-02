import {
  Box,
  Button,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from '@mui/material'
import { useUnit } from 'effector-react/scope'

import { Center } from '@/shared/components'
import SplitButton from '@/shared/components/split-button'

import {
  CreateWorkspaceDialog,
  DeleteWorkspaceDialog,
  WorkspacesContainer,
  createWorkspaceDialogModel,
  deleteWorkspaceDialogModel,
} from '@/entities/workspace'
import { importWorkspaceFx } from '@/entities/workspace/model'

import { HeaderWidget } from '@/widgets/header'

export function HomePage(): JSX.Element {
  const binds = useUnit({
    openCreateWorkspaceDialog: createWorkspaceDialogModel.dialogOpened,
    openDeleteWorkspaceDialog: deleteWorkspaceDialogModel.dialogOpened,
    importWorkspace: importWorkspaceFx,
  })
  return (
    <Box display="flex" flexDirection="column" padding={2}>
      <HeaderWidget title={<Typography variant="h4">Workspaces</Typography>} />
      <Center topOffset="92px">
        <Paper>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            padding={2}
            minWidth="300px"
          >
            <WorkspacesContainer
              onDelete={(ws) => binds.openDeleteWorkspaceDialog(ws.id)}
            />
            <SplitButton
              options={
                <MenuList>
                  <MenuItem onClick={binds.importWorkspace}>
                    Import workspace
                  </MenuItem>
                </MenuList>
              }
            >
              <Button
                sx={{ flexGrow: 1 }}
                onClick={binds.openCreateWorkspaceDialog}
              >
                Create workspace
              </Button>
            </SplitButton>
          </Box>
        </Paper>
      </Center>
      <CreateWorkspaceDialog />
      <DeleteWorkspaceDialog />
    </Box>
  )
}
