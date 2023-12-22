'use client'

import { ChangeEvent } from 'react'
import { css } from '@styled-system/css'
import { useEditorStore } from '@/store'
import { ImageIcon } from '@/components/icons/ImageIcon'
import { Button } from '@/components/basic/Button'

interface UploadButtonProps {
  title?: string
  showPulse?: boolean
}

export const UploadButton = ({ title = 'Upload Image', showPulse = false }: UploadButtonProps) => {
  const { uploadBgImage, highlightUploadBtn } = useEditorStore()

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList
    const file = files[0]
    uploadBgImage(file)
  }

  return (
    <label htmlFor="image-upload">
      <input
        className={inputStyle}
        type="file"
        id="image-upload"
        accept="image/jpg,image/jpeg,image/png"
        onChange={onUpload}
      />
      <Button effect={highlightUploadBtn ? 'shake' : showPulse ? 'pulse' : undefined}>
        <div className={iconWrapper}>
          <ImageIcon />
        </div>
        {title}
      </Button>
    </label>
  )
}

const inputStyle = css({
  display: 'none',
})

const iconWrapper = css({
  w: '24px',
})
