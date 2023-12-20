'use client'

import { ChangeEvent } from 'react'
import { css } from '@styled-system/css'
import { fileToBase64 } from '@/utils/helpers'
import { useEditorStore, useStyleTransferStore } from '@/store'
import { ImageIcon } from '@/components/icons/ImageIcon'
import { Button } from '@/components/basic/Button'

export const UploadButton = () => {
  const { updateBgImage } = useEditorStore()
  const { updateStyleTransferResult } = useStyleTransferStore()

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList
    const file = files[0]
    if (!file) {
      return
    }

    const base64Image = await fileToBase64(file)
    updateBgImage(base64Image)
    updateStyleTransferResult('') // reset result
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
      <Button>
        <div className={iconWrapper}>
          <ImageIcon />
        </div>
        Upload Image
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
