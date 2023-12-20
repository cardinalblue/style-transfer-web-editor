import { cva } from '@styled-system/css'
import { styled } from '@styled-system/jsx'

const buttonRecipe = cva({
  base: {
    px: 4,
    py: 2,
    rounded: '24px',
    fontWeight: 600,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,

    userSelect: 'none',
    cursor: 'pointer',
  },
  variants: {
    theme: {
      light: {
        color: '#333',
        bgColor: '#eee',
      },
      dark: {
        color: '#eee',
        bgColor: '#333',
      },
    },
    isDisabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  defaultVariants: {
    theme: 'dark',
  },
})

export const Button = styled('div', buttonRecipe)
