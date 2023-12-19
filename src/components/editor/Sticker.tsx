'use client'

import { useEffect, useRef, useState } from 'react'
import Konva from 'konva'
import { Image, Transformer } from 'react-konva'
import useImage from 'use-image'
import { css } from '@styled-system/css'
import { StickerShapeType } from '@/types'

interface StickerProps {
  isSelected: boolean
  onSelect: () => void
  stickerInfo: StickerShapeType
}

export const Sticker = ({ isSelected, onSelect, stickerInfo }: StickerProps) => {
  const [base64, setBase64] = useState<string>('')
  const [image] = useImage(base64, 'anonymous')
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const shapeRef = useRef<Konva.Image>(null)
  const trRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    if (!image) {
      return
    }
    const maxSize = 200
    const currentMaxSize = Math.max(image.width, image.height)
    const ratio = Math.min(1, maxSize / currentMaxSize)
    setSize({ width: image.width * ratio, height: image.height * ratio })
  }, [image])

  const stickerToBase64 = async () => {
    const res = await fetch(`/api/pico-asset?url=${encodeURIComponent(stickerInfo.url)}`)
    const data = await res.json()
    setBase64(data.dataUrl)
  }

  useEffect(() => {
    stickerToBase64()
    return () => {
      shapeRef.current?.destroy()
      trRef.current?.destroy()
    }
  }, [])

  return (
    <>
      <Image
        data-sticker-id={stickerInfo.id}
        ref={shapeRef}
        x={position.x}
        y={position.y}
        width={size?.width}
        height={size?.height}
        draggable
        alt=""
        image={image}
        onDragEnd={(e) => {
          setPosition({ x: e.target.x(), y: e.target.y() })
        }}
        onClick={onSelect}
        onMouseDown={onSelect}
        onTouchStart={onSelect}
      />

      {!!shapeRef.current && isSelected && (
        <Transformer
          ref={trRef}
          nodes={[shapeRef.current]}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          anchorStyleFunc={(anchor: Konva.Image) => {
            anchor.cornerRadius(10)
          }}
        />
      )}
    </>
  )
}

const container = css({
  bgColor: 'wheat',
})
