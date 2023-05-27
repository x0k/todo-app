import { ArrowDropDown } from '@mui/icons-material'
import {
  Button,
  ButtonGroup,
  type ButtonGroupProps,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
} from '@mui/material'
import { useRef, useState } from 'react'

export interface SplitButtonProps extends ButtonGroupProps {
  options: React.ReactElement
}

export default function SplitButton({
  children,
  options,
  ...props
}: SplitButtonProps): JSX.Element {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen)
  }
  const handleClose = (event: Event): void => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return
    }
    setOpen(false)
  }
  return (
    <>
      <ButtonGroup ref={anchorRef} {...props}>
        {children}
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper onClick={handleToggle}>
              <ClickAwayListener onClickAway={handleClose}>
                {options}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}
