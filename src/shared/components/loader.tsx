import { CircularProgress } from '@mui/material'

import { Center } from './center'

export interface LoaderProps {
  size?: number
}

export function Loader({ size = 64 }: LoaderProps): JSX.Element {
  return (
    <Center>
      <CircularProgress size={size} />
    </Center>
  )
}
