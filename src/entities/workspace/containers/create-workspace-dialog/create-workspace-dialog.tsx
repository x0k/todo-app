import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useStore, useUnit } from 'effector-react/scope'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  BACKEND_TITLES,
  BACKEND_TYPES,
  type BackendType,
} from '@/shared/kernel'
import { REQUIRED_FIELD_MESSAGE } from '@/shared/validation'

import { createWorkspaceFx } from '../../model'
import { $isDialogOpen, dialogClosed } from './model'

interface CreateWorkspaceDialogFormData {
  title: string
  backendType: BackendType
}

export function CreateWorkspaceDialog(): JSX.Element {
  const isOpen = useStore($isDialogOpen)
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm<CreateWorkspaceDialogFormData>({
    defaultValues: {
      title: '',
      backendType: BACKEND_TYPES[0],
    },
  })
  const handler = useUnit({
    dialogClosed,
    createWorkspaceFx,
  })
  async function onSubmit({
    title,
    backendType,
  }: CreateWorkspaceDialogFormData): Promise<unknown> {
    return await handler.createWorkspaceFx({
      title,
      backend: { type: backendType, config: {} },
    })
  }
  function closeAndReset(): void {
    handler.dialogClosed()
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create workspace</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} paddingY={2}>
            <TextField
              {...register('title', { required: REQUIRED_FIELD_MESSAGE })}
              label="Title"
              fullWidth
              autoFocus
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
            <Controller
              control={control}
              name="backendType"
              rules={{ required: REQUIRED_FIELD_MESSAGE }}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id="backend-type-label">Backend</InputLabel>
                  <Select
                    {...field}
                    labelId="backend-type-label"
                    label="Backend"
                  >
                    {BACKEND_TYPES.map((backendType) => (
                      <MenuItem key={backendType} value={backendType}>
                        {BACKEND_TITLES[backendType]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>
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
