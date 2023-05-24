import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useUnit } from 'effector-react/scope'

import { deleteWorkspaceFx } from '../../model'
import { $isOpen, dialogClosed } from './model'

export function DeleteWorkspaceDialog(): JSX.Element {
  const binds = useUnit({
    open: $isOpen,
    close: dialogClosed,
    delete: deleteWorkspaceFx,
  })
  return (
    <Dialog
      open={binds.open !== null}
      onClose={binds.close}
      maxWidth="md"
      fullWidth
      disableRestoreFocus
    >
      <DialogTitle>Delete workspace</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Do you really want to delete this workspace? All data will be
          lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button type="reset" onClick={binds.close}>
          Cancel
        </Button>
        <Button
          type="submit"
          color="error"
          onClick={() => {
            if (binds.open !== null) {
              void binds.delete({ id: binds.open })
            }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
