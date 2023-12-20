'use client'

import { css } from '@styled-system/css'
import { StickerPanel } from '@/components/panels/StickerPanel'
import { EditorPanel } from '@/components/panels/EditorPanel'

export default function Edit() {
  return (
    <div className={container}>
      <StickerPanel />
      <EditorPanel />
    </div>
  )
}

const container = css({
  display: 'flex',
  h: '100dvh',
  overflow: 'hidden',
})
