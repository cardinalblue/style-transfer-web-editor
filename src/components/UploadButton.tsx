'use client'

import { ChangeEvent } from 'react'
import { css } from '@styled-system/css'
import { fileToBase64 } from '@/utils/helpers'
import { useEditorStore } from '@/store/editorStore'
import { ImageIcon } from '@/components/icons/ImageIcon'

export const UploadButton = () => {
  const { updateBgImage } = useEditorStore()

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList
    const file = files[0]
    if (!file) {
      return
    }

    const base64Image = await fileToBase64(file)
    updateBgImage(base64Image)
  }

  return (
    <label htmlFor="image-upload" className={labelStyle}>
      <input
        className={inputStyle}
        type="file"
        id="image-upload"
        accept="image/jpg,image/jpeg,image/png,image/heic"
        onChange={handleUpload}
      />
      <div className={imageIconWrapper}>
        <ImageIcon />
      </div>
      Upload Image
    </label>
  )
}

const labelStyle = css({
  w: '160px',
  h: '40px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
  rounded: 'md',
  fontWeight: 600,
  color: '#eee',
  bgColor: '#333',
  cursor: 'pointer',
  transition: 'all 0.2s',
})

const inputStyle = css({
  display: 'none',
})

const imageIconWrapper = css({
  w: '24px',
})
