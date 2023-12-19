'use client'

import { useEffect, useState } from 'react'
import { Image } from 'react-konva'
import useImage from 'use-image'
import { useEditorStore } from '@/store'

const MAX_IMAGE_SIZE = 800

export const UserImage = () => {
  const [image] = useImage(
    'https://images.pexels.com/photos/19436409/pexels-photo-19436409/free-photo-of-people-playing-soccer.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'anonymous'
  )

  const { editorSize, updateEditorSize } = useEditorStore()

  useEffect(() => {
    if (!image) {
      return
    }
    const currentMaxSize = Math.max(image.width, image.height)
    const ratio = Math.min(1, MAX_IMAGE_SIZE / currentMaxSize)
    updateEditorSize(image.width * ratio, image.height * ratio)
  }, [image])

  return <Image width={editorSize.width} height={editorSize.height} alt="" image={image} />
}
