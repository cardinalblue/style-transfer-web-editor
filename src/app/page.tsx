'use client'

import { css } from '@styled-system/css'
import { StickerPanel } from '@/components/panels/StickerPanel'
import { EditorPanel } from '@/components/panels/EditorPanel'
import { WelcomePanel } from '@/components/panels/WelcomePanel'
import { useEditorStore } from '@/store'

export default function Edit() {
  const { bgImage } = useEditorStore()
  return (
    <div className={container}>
      <StickerPanel />
      {!!bgImage ? <EditorPanel /> : <WelcomePanel />}
    </div>
  )
}

const container = css({
  display: 'flex',
  flexDirection: 'column',
  h: '100dvh',
  lg: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
})
