'use client'

import { ChangeEvent } from 'react'
import { css } from '@styled-system/css'
import { fileToBase64 } from '@/utils/helpers'
import { useEditorStore } from '@/store/editorStore'

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
      Upload Image
    </label>
  )
}

const labelStyle = css({
  w: '150px',
  h: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  rounded: 'md',
  bgColor: 'wheat',
  cursor: 'pointer',
})

const inputStyle = css({
  display: 'none',
})
