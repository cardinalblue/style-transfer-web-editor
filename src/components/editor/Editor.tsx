'use client'

import { useRef, useEffect, useState } from 'react'
import Konva from 'konva'
import { Stage, Layer } from 'react-konva'
import { useEditorStore } from '@/store'
import { UserImage } from './Image'
import { Sticker } from './Sticker'
import { MAX_BG_IMAGE_SIZE } from '@/utils/constants'

const Editor = () => {
  const [sizeRatio, setSizeRatio] = useState(1)
  const stageRef = useRef<Konva.Stage>(null)

  const {
    bgImage,
    stickerShapes,
    selectedId,
    editorSize,
    updateEditorSize,
    updateSelectedId,
    removeSticker,
    updateEditorScreenshot,
  } = useEditorStore()

  const getLatestScreenshot = async () => {
    // clone the stage and remove all transformers
    const cloneStage = stageRef.current?.clone()
    const cloneLayer = cloneStage?.children?.[0]
    cloneLayer?.children?.forEach((item) => {
      if (item.getClassName() === 'Transformer') {
        item.destroy()
      }
    })
    const uri = cloneStage?.toDataURL({
      pixelRatio: 1 / sizeRatio,
      width: editorSize.width * sizeRatio,
      height: editorSize.height * sizeRatio,
    })
    updateEditorScreenshot(uri ?? '')
  }

  const onStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const targetId = e.target.attrs['data-sticker-id']
    updateSelectedId(targetId ?? null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      const isDelete = e.key === 'Delete' || e.key === 'Backspace'
      if (isDelete && el.tagName === 'BODY') {
        e.preventDefault()
        removeSticker()
      }
    }
    window?.addEventListener('keydown', handleKeyDown)
    return () => {
      window?.removeEventListener('keydown', handleKeyDown)
    }
  }, [stageRef.current])

  // useEffect(() => {
  //   const handleResize = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 100)) // wait for canvas to update
  //     const editorPanelDom = document.getElementById('edit-section')
  //     const computedStyle = getComputedStyle(editorPanelDom as HTMLElement)
  //     let editorPanelWidth = editorPanelDom?.clientWidth ?? 0
  //     editorPanelWidth -=
  //       parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
  //     const editorEstimatedWidth = Math.min(editorPanelWidth / 2, MAX_BG_IMAGE_SIZE)

  //     const containerDom = document.getElementById('stage-parent')
  //     const containerWidth = containerDom?.clientWidth ?? 0
  //     const containerHeight = containerDom?.clientHeight ?? 0
  //     const ratio = editorEstimatedWidth / containerWidth
  //     setSizeRatio(ratio)
  //     updateEditorSize(containerWidth * ratio, containerHeight * ratio)
  //   }
  //   window.addEventListener('resize', handleResize)
  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  return (
    <Stage
      id="stage-parent"
      ref={stageRef}
      width={editorSize.width}
      height={editorSize.height}
      scale={{ x: sizeRatio, y: sizeRatio }}
      onClick={onStageClick}
    >
      <Layer>
        <UserImage onChange={getLatestScreenshot} />
        {stickerShapes.map((item) => (
          <Sticker
            key={item.id}
            stickerInfo={item}
            isSelected={selectedId === item.id}
            onChange={getLatestScreenshot}
          />
        ))}
      </Layer>
    </Stage>
  )
}

export default Editor
