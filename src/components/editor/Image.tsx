'use client'

import { useEffect } from 'react'
import { Image } from 'react-konva'
import useImage from 'use-image'
import { useEditorStore } from '@/store'
import { MAX_BG_IMAGE_SIZE } from '@/utils/constants'

export const UserImage = () => {
  const { editorSize, bgImage, updateEditorSize } = useEditorStore()
  const [image] = useImage(bgImage ?? '', 'anonymous')

  useEffect(() => {
    if (!image) {
      return
    }
    const currentMaxSize = Math.max(image.width, image.height)
    const ratio = Math.min(1, MAX_BG_IMAGE_SIZE / currentMaxSize)
    updateEditorSize(image.width * ratio, image.height * ratio)
  }, [image])

  return <Image width={editorSize.width} height={editorSize.height} alt="" image={image} />
}
