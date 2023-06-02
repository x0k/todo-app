import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useUnit } from 'effector-react/scope'

import { type Workspace } from '@/shared/kernel'

import { exportWorkspaceFx } from '../../model'
import { $isOpen, dialogClosed } from './model'

export interface WorkspaceSettingsDialogProps {
  workspace: Workspace
}

export function WorkspaceSettingsDialog({
  workspace,
}: WorkspaceSettingsDialogProps): JSX.Element {
  const binds = useUnit({
    open: $isOpen,
    close: dialogClosed,
    exportWorkspace: exportWorkspaceFx,
  })
  return (
    <Dialog
      open={binds.open}
      onClose={binds.close}
      maxWidth="md"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle variant="h5">Workspace settings</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Export</Typography>
        {/* <DialogContentText>Some content</DialogContentText> */}
        <Button
          onClick={() => {
            void binds.exportWorkspace(workspace.id)
          }}
        >
          Export to JSON
        </Button>
      </DialogContent>
      <DialogActions>
        <Button type="reset" onClick={binds.close}>
          Close
        </Button>
        {/* <Button type="submit">Save</Button> */}
      </DialogActions>
    </Dialog>
  )
}
