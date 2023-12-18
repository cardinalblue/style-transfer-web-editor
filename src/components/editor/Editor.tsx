'use client'

import { useRef, useEffect, useState } from 'react'
import Konva from 'konva'
import { Stage, Layer } from 'react-konva'
import { css } from '@styled-system/css'
import { UserImage } from './Image'
import { Sticker } from './Sticker'
import { useEditorStore } from '@/store'

const ratio = 1

export const Editor = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const [exportUri, setExportUri] = useState<string>('')

  const { stickerList, selectedId, updateSelectedId, canvasSize } = useEditorStore()

  const onSave = async () => {
    updateSelectedId(null) // cancel selected behavior
    await new Promise((r) => setTimeout(r, 100)) // wait for cancel selected behavior
    const uri =
      stageRef.current?.toDataURL({
        // pixelRatio: 1.2,
        width: canvasSize.width * ratio,
        height: canvasSize.height * ratio,
      }) ?? ''
    setExportUri(uri)
  }

  const onStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const targetId = e.target.attrs['data-sticker-id']
    updateSelectedId(targetId ?? null)
  }

  return (
    <>
      <button onClick={onSave}>on save</button>
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        scale={{ x: ratio, y: ratio }}
        onClick={onStageClick}
      >
        <Layer>
          <UserImage />
          {stickerList.map((item) => (
            <Sticker
              key={item.id}
              stickerInfo={item}
              isSelected={selectedId === item.id}
              onSelect={() => {
                updateSelectedId(item.id)
              }}
            />
          ))}
        </Layer>
      </Stage>
      <div
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          background: `url(${exportUri}) no-repeat center / contain`,
        }}
      ></div>
    </>
  )
}

const container = css({
  bgColor: 'wheat',
})
