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

  const { canvasSize, updateCanvasSize } = useEditorStore()

  useEffect(() => {
    if (!image) {
      return
    }
    const currentMaxSize = Math.max(image.width, image.height)
    const ratio = Math.min(1, MAX_IMAGE_SIZE / currentMaxSize)
    updateCanvasSize(image.width * ratio, image.height * ratio)
  }, [image])

  return <Image width={canvasSize.width} height={canvasSize.height} alt="" image={image} />
}
