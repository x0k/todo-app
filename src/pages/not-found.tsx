import { Button, Typography } from '@mui/material'
import { useUnit } from 'effector-react/scope'

import { Center } from '@/shared/components'
import { routes } from '@/shared/routes'

export function NotFoundPage(): JSX.Element {
  const toHome = useUnit(routes.home.open)
  return (
    <Center>
      <Typography>404 Not Found Page</Typography>
      <Button onClick={toHome}>Back to Home</Button>
    </Center>
  )
}
