'use client'

import { useEffect, useRef } from 'react'
import { Image } from 'react-konva'
import Konva from 'konva'
import useImage from 'use-image'
import { useEditorStore } from '@/store'
import { MAX_BG_IMAGE_SIZE } from '@/utils/constants'

export const UserImage = () => {
  const { editorSize, bgImage, updateEditorSize } = useEditorStore()
  const [image] = useImage(bgImage ?? '', 'anonymous')

  const imageRef = useRef<Konva.Image>(null)

  useEffect(() => {
    if (!image) {
      return
    }
    const currentMaxSize = Math.max(image.width, image.height)
    const ratio = Math.min(1, MAX_BG_IMAGE_SIZE / currentMaxSize)
    updateEditorSize(image.width * ratio, image.height * ratio)
  }, [image])

  useEffect(() => {
    return () => {
      imageRef.current?.destroy()
    }
  }, [])

  return (
    <Image
      ref={imageRef}
      width={editorSize.width}
      height={editorSize.height}
      alt=""
      image={image}
    />
  )
}
