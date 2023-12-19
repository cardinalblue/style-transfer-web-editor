'use client'

import { useRef, useEffect } from 'react'
import Konva from 'konva'
import { Stage, Layer } from 'react-konva'
import { css } from '@styled-system/css'
import { useQuery } from '@tanstack/react-query'
import { UserImage } from './Image'
import { Sticker } from './Sticker'
import { useEditorStore, useStyleTransferStore } from '@/store'

const ratio = 1

const Editor = () => {
  const stageRef = useRef<Konva.Stage>(null)

  const {
    stickerShapes,
    selectedId,
    editorSize,
    previewImage,
    updateSelectedId,
    removeSticker,
    updatePreviewImage,
  } = useEditorStore()
  const { applyStyleTransfer } = useStyleTransferStore()

  const abortController = useRef<AbortController | null>(null)

  const handleLatestPreviewImage = async () => {
    await new Promise((resolve) => setTimeout(resolve, 200)) // wait for sticker to be added
    // clone the stage and remove all transformers
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
    updatePreviewImage(uri)

    await new Promise((resolve) => setTimeout(resolve, 100)) // wait for preview image to be updated
    abortController.current?.abort()
    refetch()
  }

  const {
    data: styletransferRes,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['style-transfer'],
    queryFn: () => {
      abortController.current = new AbortController()
      return applyStyleTransfer(previewImage, abortController.current?.signal)
    },
    enabled: false,
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
    const container = stageRef.current?.container()
    container?.setAttribute('tabIndex', '1')
    container?.focus()
    container?.addEventListener('keydown', handleKeyDown)
    return () => {
      container?.removeEventListener('keydown', handleKeyDown)
    }
  }, [stageRef.current])

  return (
    <div className={container}>
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
              onChange={handleLatestPreviewImage}
            />
          ))}
        </Layer>
      </Stage>
      <div
        className={image}
        style={{
          width: editorSize.width,
          height: editorSize.height,
          backgroundImage: `url(${previewImage})`,
        }}
      ></div>
      <div
        className={image}
        style={{
          width: editorSize.width,
          height: editorSize.height,
          backgroundImage: `url(${styletransferRes})`,
          opacity: isFetching ? 0.5 : 1,
        }}
      ></div>
      <div></div>
    </div>
  )
}

export default Editor

const container = css({
  display: 'flex',
  gap: 4,
})

const image = css({
  background: 'no-repeat center / contain',
  flexShrink: 0,
})
