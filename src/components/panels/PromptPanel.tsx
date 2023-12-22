'use client'

import { useState } from 'react'
import { useDebounce } from 'react-use'
import { css } from '@styled-system/css'
import { Root, Trigger, Content, Item, Portal } from '@radix-ui/react-dropdown-menu'
import { useStyleTransferStore } from '@/store'
import { Button } from '@/components/basic/Button'
import { PROMPT_LIST } from '@/utils/constants'

export const PromptPanel = () => {
  const { updateUserPrompt } = useStyleTransferStore()
  const [inputText, setInputText] = useState(PROMPT_LIST[0].prompt)
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

  const onSelectPrompt = (prompt: string) => {
    setInputText(prompt)
    updateUserPrompt(prompt)
  }

  return (
    <div className={container}>
      <div className={header}>
        <Root>
          <Trigger asChild>
            <Button size="sm" theme="light">
              Prompt List
            </Button>
          </Trigger>
          <Portal>
            <Content side="right" sideOffset={15} className={promptGroup}>
              {PROMPT_LIST.map((item) => (
                <Item
                  key={item.id}
                  className={promptItem}
                  onClick={() => onSelectPrompt(item.prompt)}
                >
                  {item.name}
                </Item>
              ))}
            </Content>
          </Portal>
        </Root>
        <div className={statusText}>
          {isTyping ? 'typing...' : !inputText ? 'Please enter the prompt' : ''}
        </div>
      </div>

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
      </div>
    </div>
  )
}

const container = css({
  p: 3,
  mt: 'auto',
  rounded: 'lg',
  color: '#eee',
  bgColor: '#333',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 3,
})

const header = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const statusText = css({
  fontSize: '14px',
  fontWeight: 500,
})

const promptGroup = css({
  p: 2,
  rounded: 'lg',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  color: '#333',
  bgColor: '#fff',
  boxShadow: '2px 4px 10px rgba(0,0,0,0.3)',
  animation: 'fadeIn 0.15s ease-in-out',
  zIndex: 1,
})

const promptItem = css({
  px: 2,
  py: 1,
  rounded: 'md',
  fontWeight: 500,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  _hover: {
    bgColor: '#ddd',
  },
})

const inputWrapper = css({
  flex: 1,
  position: 'relative',
})

const textareaStyle = css({
  w: '100%',
  h: '100%',
  p: 3,
  rounded: 'lg',
  bgColor: 'rgba(255,255,255,0.1)',
  resize: 'none',
  _focusVisible: {
    outline: 'none',
  },
})
