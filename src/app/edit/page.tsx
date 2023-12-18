'use client'

import { css } from '@styled-system/css'
import { Editor } from '@/components/editor'

export default function Edit() {
  return (
    <div className={container}>
      <Editor />
    </div>
  )
}

const container = css({})
