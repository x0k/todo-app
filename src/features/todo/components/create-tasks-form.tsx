import { Autocomplete, Box, Button, TextField } from '@mui/material'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { REQUIRED_FIELD_MESSAGE } from '@/common/validation'

import { type TasksList } from '../model'

export interface CreateTasksFormProps {
  tasksLists: TasksList[]
  onSubmit: (data: FormData) => void
}

interface TaskData {
  title: string
}

type TasksListData = string | TasksList

export interface FormData {
  tasks: TaskData[]
  tasksList: TasksListData
}

function getOptionLabel(option: string | TasksListData): string {
  return typeof option === 'string' ? option : option.title
}

export function CreateTasksForm({
  tasksLists,
  onSubmit,
}: CreateTasksFormProps): JSX.Element {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
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
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        {fields.map((field, index) => (
          <TextField
            {...register(`tasks.${index}.title`, {
              required: REQUIRED_FIELD_MESSAGE,
            })}
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
                      const el = document.querySelector(
                        `[name="tasks.${index - 1}.title"]`
                      )
                      if (el instanceof HTMLElement) {
                        el.focus()
                      }
                      remove(index)
                    }
                    break
                }
              },
            }}
            key={field.id}
            label="Task"
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
              freeSolo
              options={tasksLists}
              onBlur={onBlur}
              ref={ref}
              value={value}
              getOptionLabel={getOptionLabel}
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
                  label="Tasks List"
                  error={Boolean(error)}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />
        <Button variant="contained" type="submit">
          Create
        </Button>
      </Box>
    </form>
  )
}
