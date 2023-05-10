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

import { type TaskId, type WorkspaceId } from '@/shared/kernel'

import { $workspaceId, completeTaskFx } from '@/entities/todo'

import { $currentTask, close } from './model'

interface CompleteTaskDialogFormData {
  message: string
  taskId: TaskId
  workspaceId: WorkspaceId
}

export function CompleteTaskDialog(): JSX.Element {
  const task = useStore($currentTask)
  const workspaceId = useStore($workspaceId)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitSuccessful },
  } = useForm<CompleteTaskDialogFormData>({
    defaultValues: {
      message: '',
    },
  })
  useEffect(() => {
    if (task) {
      setValue('taskId', task.id)
      setValue('workspaceId', workspaceId)
    }
  }, [task, workspaceId])
  const handler = useUnit({ completeTaskFx, close })
  function closeAndReset(): void {
    handler.close()
    reset()
  }
  useEffect(closeAndReset, [isSubmitSuccessful])
  return (
    <Dialog
      open={task !== null}
      onClose={closeAndReset}
      maxWidth="md"
      fullWidth
      disableRestoreFocus
    >
      <form onSubmit={handleSubmit(handler.completeTaskFx)}>
        <DialogTitle>Complete {task?.title}</DialogTitle>
        <DialogContent>
          <TextField
            {...register('message')}
            label="Result"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button type="reset" onClick={closeAndReset}>
            Cancel
          </Button>
          <Button type="submit">Complete</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
