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
      <UploadButton />
      <Editor />
    </div>
  )
}

const container = css({})
