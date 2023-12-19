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

  const { stickerShapes, selectedId, updateSelectedId, editorSize, removeSticker } =
    useEditorStore()

  const onSave = async () => {
    updateSelectedId(null) // cancel selected behavior
    await new Promise((r) => setTimeout(r, 100)) // wait for cancel selected behavior
    const uri =
      stageRef.current?.toDataURL({
        // pixelRatio: 1.2,
        width: editorSize.width * ratio,
        height: editorSize.height * ratio,
      }) ?? ''
    setExportUri(uri)
  }

  const onStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const targetId = e.target.attrs['data-sticker-id']
    updateSelectedId(targetId ?? null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isDelete = e.key === 'Delete' || e.key === 'Backspace'
      if (isDelete) {
        e.preventDefault()
        removeSticker()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className={container}>
      <button onClick={onSave}>on save</button>
      <Stage
        ref={stageRef}
        width={editorSize.width}
        height={editorSize.height}
        scale={{ x: ratio, y: ratio }}
        onClick={onStageClick}
      >
        <Layer>
          <UserImage />
          {stickerShapes.map((item) => (
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
          width: editorSize.width,
          height: editorSize.height,
          background: `url(${exportUri}) no-repeat center / contain`,
        }}
      ></div>
    </div>
  )
}

const container = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
})
