'use client'

import { css } from '@styled-system/css'
import { Editor } from '@/components/editor'
import { StickerPanel } from '@/components/tools/StickerPanel'

export default function Edit() {
  return (
    <div className={container}>
      <StickerPanel />
      <Editor />
    </div>
  )
}

const container = css({})
