'use client'

import dynamic from 'next/dynamic'
import { css } from '@styled-system/css'
import { StickerPanel } from '@/components/tools/StickerPanel'
import { UploadButton } from '@/components/tools/UploadButton'

const Editor = dynamic(() => import('@/components/editor/Editor'), {
  ssr: false,
})

export default function Edit() {
  return (
    <div className={container}>
      <StickerPanel />
      <div>
        <UploadButton />
        <Editor />
      </div>
    </div>
  )
}

const container = css({
  display: 'flex',
  gap: 4,
  h: '100dvh',
  overflow: 'hidden',
})
