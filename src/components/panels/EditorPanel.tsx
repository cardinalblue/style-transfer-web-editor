'use client'

import dynamic from 'next/dynamic'
import { css } from '@styled-system/css'
import { UploadButton } from '@/components/controls/UploadButton'
import { SaveButton } from '@/components/controls/SaveButton'
import { ResultImage } from '@/components/editor/ResultImage'

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
  overflow: 'hidden',
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
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: 1,
})
