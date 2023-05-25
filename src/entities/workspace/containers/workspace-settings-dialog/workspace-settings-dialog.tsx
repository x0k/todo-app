import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useUnit } from 'effector-react/scope'

import { $isOpen, dialogClosed } from './model'

export function WorkspaceSettingsDialog(): JSX.Element {
  const binds = useUnit({
    open: $isOpen,
    close: dialogClosed,
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
        <DialogContentText>Some content</DialogContentText>
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
