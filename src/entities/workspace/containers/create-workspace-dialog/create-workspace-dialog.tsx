import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useStore, useUnit } from 'effector-react/scope'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { REQUIRED_FIELD_MESSAGE } from '@/shared/validation'

import { createWorkspaceFx } from '../../model'
import { $isDialogOpen, dialogClosed } from './model'

interface CreateWorkspaceDialogFormData {
  title: string
}

export function CreateWorkspaceDialog(): JSX.Element {
  const isOpen = useStore($isDialogOpen)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateWorkspaceDialogFormData>({
    defaultValues: {
      title: '',
    },
  })
  const handler = useUnit({
    close: dialogClosed,
    createWorkspaceFx,
  })
  function closeAndReset(): void {
    handler.close()
    reset()
  }
  useEffect(closeAndReset, [isSubmitSuccessful])
  return (
    <Dialog
      open={isOpen}
      onClose={closeAndReset}
      maxWidth="md"
      fullWidth
      disableRestoreFocus
    >
      <form onSubmit={handleSubmit(handler.createWorkspaceFx)}>
        <DialogTitle>Create workspace</DialogTitle>
        <DialogContent>
          <TextField
            {...register('title', { required: REQUIRED_FIELD_MESSAGE })}
            label="Title"
            fullWidth
            autoFocus
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button type="reset" onClick={closeAndReset}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
