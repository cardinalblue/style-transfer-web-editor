'use client'

import dynamic from 'next/dynamic'
import { css } from '@styled-system/css'
import { UploadButton } from '@/components/controls/UploadButton'
import { SaveButton } from '@/components/controls/SaveButton'
import { ResultImage } from '@/components/editor/ResultImage'
import { PromptPanel } from '@/components/panels/PromptPanel'

const Editor = dynamic(() => import('@/components/editor/Editor'), {
  ssr: false,
})

export const EditorPanel = () => {
  return (
    <div className={container}>
      <div className={header}>
        <UploadButton title="Change Image" />
        <SaveButton />
      </div>
      <div className={imageGroup}>
        <Editor />
        <ResultImage />
      </div>
      <PromptPanel />
    </div>
  )
}

const container = css({
  minH: '100vh',
  flex: 1,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 4,
  lg: {
    maxW: '1080px',
    mx: 'auto',
  },
})

const header = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 4,
})

const imageGroup = css({
  p: 3,
  flex: 1,
  rounded: 'md',
  bgColor: '#ececec',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: '100%',
  gap: 1,
  overflow: 'hidden',
})
