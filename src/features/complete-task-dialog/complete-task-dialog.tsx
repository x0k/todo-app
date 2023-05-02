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

import { type TaskId, completeTaskFx } from '@/entities/todo'

import { $currentTask, close } from './model'

interface CompleteTaskDialogFormData {
  result: string
  taskId: TaskId
}

async function onSubmit({
  result,
  taskId,
}: CompleteTaskDialogFormData): Promise<unknown> {
  return await completeTaskFx({ taskId, message: result })
}

export function CompleteTaskDialog(): JSX.Element {
  const task = useStore($currentTask)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitSuccessful },
  } = useForm<CompleteTaskDialogFormData>()
  useEffect(() => {
    if (task) {
      setValue('taskId', task.id)
    }
  }, [task])
  function closeAndReset(): void {
    close()
    reset()
  }
  useEffect(closeAndReset, [isSubmitSuccessful])
  return (
    <Dialog
      open={task !== null}
      onClose={closeAndReset}
      maxWidth="md"
      fullWidth
      slots={{
        root: 'form',
      }}
      slotProps={{
        root: {
          onSubmit: handleSubmit(onSubmit),
        },
      }}
    >
      <DialogTitle>Complete {task?.title}</DialogTitle>
      <DialogContent>
        <TextField
          {...register('result', { required: REQUIRED_FIELD_MESSAGE })}
          label="Result"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
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
