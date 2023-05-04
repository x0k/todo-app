import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useStore } from 'effector-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { REQUIRED_FIELD_MESSAGE } from '@/shared/validation'

import { createWorkspaceFx } from '@/entities/workspace/model'

import { $isOpen } from '../create-tasks-panel'

interface CreateWorkspaceDialogFormData {
  title: string
}

async function onSubmit(data: CreateWorkspaceDialogFormData): Promise<unknown> {
  return await createWorkspaceFx(data)
}

export function CreateWorkspaceDialog(): JSX.Element {
  const isOpen = useStore($isOpen)
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
  function closeAndReset(): void {
    close()
    reset()
  }
  useEffect(closeAndReset, [isSubmitSuccessful])
  return (
    <Dialog
      open={isOpen}
      onClose={closeAndReset}
      maxWidth="md"
      fullWidth
      slots={{
        root: 'form',
      }}
      slotProps={{
        root: {
          style: {
            position: 'fixed',
            zIndex: 1300,
            right: 0,
            bottom: 0,
            top: 0,
            left: 0,
          },
          onSubmit: handleSubmit(onSubmit),
        },
      }}
    >
      <DialogTitle>Create workspace</DialogTitle>
      <DialogContent>
        <TextField
          {...register('title', { required: REQUIRED_FIELD_MESSAGE })}
          label="Title"
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
        />
      </DialogContent>
      <DialogActions>
        <Button type="reset" onClick={closeAndReset}>
          Cancel
        </Button>
        <Button type="submit">Complete</Button>
      </DialogActions>
    </Dialog>
  )
}