import { cva } from '@styled-system/css'
import { styled } from '@styled-system/jsx'

const buttonRecipe = cva({
  base: {
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
    size: {
      sm: {
        px: 2,
        py: 1,
        fontSize: '14px',
        rounded: '16px',
      },
      md: {
        px: 4,
        py: 2,
        rounded: '24px',
      },
    },

    isDisabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },

    effect: {
      pulse: {
        position: 'relative',
        zIndex: 1,
        _before: {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          w: '100%',
          h: '100%',
          bgColor: 'inherit', // prevent gap between button and pulse
          rounded: 'inherit',
          zIndex: -1,
          animation: 'buttonPulse 1.2s infinite linear',
          pointerEvents: 'none',
        },
      },
      shake: {
        animation: 'shake 0.25s infinite linear',
      },
    },
  },
  defaultVariants: {
    theme: 'dark',
    size: 'md',
  },
})

export const Button = styled('div', buttonRecipe)
