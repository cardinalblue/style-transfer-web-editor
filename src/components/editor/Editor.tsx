'use client'

import { useRef, useEffect, useState } from 'react'
import Konva from 'konva'
import { Stage, Layer } from 'react-konva'
import { css } from '@styled-system/css'
import { useQuery } from '@tanstack/react-query'
import { UserImage } from './Image'
import { Sticker } from './Sticker'
import { useEditorStore, useStyleTransferStore } from '@/store'

const ratio = 1

export const Editor = () => {
  const stageRef = useRef<Konva.Stage>(null)
  const [exportUri, setExportUri] = useState<string>('')

  const { stickerShapes, selectedId, updateSelectedId, editorSize, removeSticker } =
    useEditorStore()

  const { applyStyleTransfer } = useStyleTransferStore()

  const onSave = async () => {
    setExportUri('')
    await new Promise((resolve) => setTimeout(resolve, 100))
    // clone a stage and remove all transformers
    const cloneStage = stageRef.current?.clone()
    const cloneLayer = cloneStage?.children?.[0]
    cloneLayer?.children?.forEach((item) => {
      if (item.getClassName() === 'Transformer') {
        item.destroy()
      }
    })
    const uri =
      cloneStage?.toDataURL({
        // pixelRatio: 1.2,
        width: editorSize.width * ratio,
        height: editorSize.height * ratio,
      }) ?? ''
    setExportUri(uri)
  }

  const {
    data: styletransferRes,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['style-transfer'],
    queryFn: () => applyStyleTransfer(exportUri),
    enabled: !!exportUri,
  })

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
      {isFetching ? (
        'please wait'
      ) : (
        <div
          style={{
            width: editorSize.width,
            height: editorSize.height,
            background: `url(${styletransferRes}) no-repeat center / contain`,
          }}
        ></div>
      )}
      <div></div>
    </div>
  )
}

const container = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
})
