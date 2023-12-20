'use client'

import { useState } from 'react'
import { useDebounce } from 'react-use'
import { css } from '@styled-system/css'
import { useStyleTransferStore } from '@/store'
import { Button } from '@/components/basic/Button'

const defaultPrompt =
  'highly detailed watercolor painting, clean brush stroke in beautiful colors, illustration, digital art, concept art, paint on canvas, masterpiece, extreme high quality, sharp focus, professional, 4k, max detail, highres, high detail, smooth, aesthetic, extremely detailed, 8k, uhd'

export const PromptPanel = () => {
  const { updateUserPrompt } = useStyleTransferStore()
  const [inputText, setInputText] = useState(defaultPrompt)
  const [isTyping, setIsTyping] = useState(false)

  useDebounce(
    () => {
      setIsTyping(false)
      if (inputText.trim()) {
        updateUserPrompt(inputText)
      }
    },
    800,
    [inputText]
  )

  const onSelectPrompt = () => {
    setInputText(defaultPrompt)
  }

  return (
    <div className={container}>
      <Button theme="light" onClick={onSelectPrompt}>
        Use Default Prompt
      </Button>

      <div className={inputWrapper}>
        <textarea
          className={textareaStyle}
          cols={30}
          rows={5}
          value={inputText}
          onChange={(e) => {
            setIsTyping(true)
            setInputText(e.target.value)
          }}
        ></textarea>
        <div className={statusText}>
          {isTyping ? 'typing...' : !inputText ? 'Please enter the prompt' : ''}
        </div>
      </div>
    </div>
  )
}

const container = css({
  w: '100%',
  p: 4,
  mt: 'auto',
  rounded: 'lg',
  color: '#eee',
  bgColor: '#333',

  display: 'flex',
  alignItems: 'center',
  // justifyContent: 'center',
  gap: 4,
})

const inputWrapper = css({
  flex: 1,
})

const textareaStyle = css({
  w: '100%',
  p: 3,
  rounded: 'lg',
  bgColor: 'rgba(255,255,255,0.1)',
  resize: 'none',
  _focusVisible: {
    outline: 'none',
  },
})

const statusText = css({
  h: 4,
})
