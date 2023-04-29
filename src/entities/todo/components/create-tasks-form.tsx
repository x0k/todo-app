import { Autocomplete, Box, Button, TextField } from '@mui/material'
import { useEffect, useRef } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { REQUIRED_FIELD_MESSAGE } from '@/shared/validation'

import { type TasksList } from '@/entities/todo'

export interface CreateTasksFormProps {
  tasksLists: TasksList[]
  onSubmit: (data: CreateTasksFormData) => void
  onTouched?: (isDirty: boolean) => void
}

interface TaskData {
  title: string
}

type TasksListData = string | TasksList

export interface CreateTasksFormData {
  tasks: TaskData[]
  tasksList: TasksListData
}

function getOptionLabel(option: string | TasksListData): string {
  return typeof option === 'string' ? option : option.title
}

function tryFocusTaskInputByIndex(
  { current }: React.RefObject<HTMLFormElement>,
  index: number
): void {
  if (current === null) {
    return
  }
  const input = current.querySelector(`[name="tasks.${index}.title"]`)
  if (input instanceof HTMLElement) {
    input.focus()
  }
}

export function CreateTasksForm({
  tasksLists,
  onSubmit,
  onTouched,
}: CreateTasksFormProps): JSX.Element {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isDirty },
  } = useForm<CreateTasksFormData>({
    defaultValues: {
      tasks: [{ title: '' }],
      tasksList: '',
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasks',
    rules: { minLength: 1 },
  })
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    onTouched?.(isDirty)
  }, [isDirty, onTouched])
  useEffect(() => {
    reset()
    tryFocusTaskInputByIndex(formRef, 0)
  }, [isSubmitSuccessful])
  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        {fields.map((field, index) => (
          <TextField
            {...register(`tasks.${index}.title`, {
              required: REQUIRED_FIELD_MESSAGE,
            })}
            variant="standard"
            inputProps={{
              onKeyDown: (e) => {
                switch (e.key) {
                  case 'Enter':
                    if (e.shiftKey) {
                      return
                    }
                    e.preventDefault()
                    append({ title: '' })
                    break
                  case 'Backspace':
                    // @ts-expect-error wtf
                    if (e.target.value === '' && index > 0) {
                      e.preventDefault()
                      tryFocusTaskInputByIndex(formRef, index - 1)
                      remove(index)
                    }
                    break
                }
              },
            }}
            key={field.id}
            label="New task"
            error={Boolean(errors.tasks?.[index]?.title)}
            helperText={errors.tasks?.[index]?.title?.message}
          />
        ))}
        <Controller
          control={control}
          name="tasksList"
          rules={{
            required: REQUIRED_FIELD_MESSAGE,
          }}
          render={({
            field: { name, onBlur, onChange, ref, value },
            fieldState: { error },
          }) => (
            <Autocomplete
              selectOnFocus
              handleHomeEndKeys
              openOnFocus
              autoComplete
              autoHighlight
              freeSolo
              options={tasksLists}
              onBlur={onBlur}
              ref={ref}
              value={value}
              getOptionLabel={getOptionLabel}
              onInputChange={(_, value) => {
                onChange(value)
              }}
              onChange={(_, value) => {
                if (value === null) {
                  onChange('')
                } else {
                  onChange(value)
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name={name}
                  label="Tasks list"
                  variant="standard"
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />
        <Box display="flex" gap={2} justifyContent="stretch">
          <Button variant="outlined" type="submit" fullWidth>
            Create
          </Button>
          <Button
            type="reset"
            color="error"
            fullWidth
            onClick={() => {
              reset()
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </form>
  )
}
