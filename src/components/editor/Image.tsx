'use client'

import { useEffect, useState } from 'react'
import { Image } from 'react-konva'
import useImage from 'use-image'

const MAX_IMAGE_SIZE = 1080

export const UserImage = () => {
  const [image] = useImage(
    'https://images.pexels.com/photos/19436409/pexels-photo-19436409/free-photo-of-people-playing-soccer.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'anonymous'
  )
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!image) return
    const currentMaxSize = Math.max(image.width, image.height)
    const ratio = Math.min(1, MAX_IMAGE_SIZE / currentMaxSize)
    setSize({ width: image.width * ratio, height: image.height * ratio })
  }, [image])

  return <Image x={200} y={200} width={size?.width} height={size?.height} alt="" image={image} />
}
