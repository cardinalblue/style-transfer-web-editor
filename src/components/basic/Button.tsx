import { cva } from '@styled-system/css'
import { styled } from '@styled-system/jsx'

const buttonRecipe = cva({
  base: {
    px: 4,
    py: 2,
    rounded: 'lg',
    fontWeight: 600,
    color: '#eee',
    bgColor: '#333',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,

    userSelect: 'none',
    cursor: 'pointer',
  },
  variants: {
    isDisabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
})

export const Button = styled('div', buttonRecipe)
