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
    <div className={editSection}>
      <div className={header}>
        <UploadButton />
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

const editSection = css({
  flex: 1,
  maxW: '1080px',
  mx: 'auto',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
})

const header = css({
  w: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 4,
})

const imageGroup = css({
  w: '100%',
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
