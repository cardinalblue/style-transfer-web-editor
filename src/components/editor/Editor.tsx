'use client'

import { useRef, useEffect, useState } from 'react'
import Konva from 'konva'
import { Stage, Layer } from 'react-konva'
import { useEditorStore } from '@/store'
import { css } from '@styled-system/css'
import { UserImage } from './Image'
import { Sticker } from './Sticker'

const Editor = () => {
  const [sizeRatio, setSizeRatio] = useState(1)
  const stageRef = useRef<Konva.Stage>(null)

  const {
    stickerShapes,
    selectedId,
    bgImageSize,
    updateSelectedId,
    removeSticker,
    updateEditorScreenshot,
  } = useEditorStore()

  const [stageSize, setStageSize] = useState({ ...bgImageSize })
  const timerRef = useRef<NodeJS.Timeout | null>(null)

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
      width: stageSize.width,
      height: stageSize.height,
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

  useEffect(() => {
    if (stageSize.width === 0 || stageSize.height === 0) {
      return
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      getLatestScreenshot() // TODO: reduce trigger
    }, 200)
  }, [stageSize])

  useEffect(() => {
    if (bgImageSize.width === 0 || bgImageSize.height === 0) {
      return
    }
    const handleResize = async () => {
      const editorPanelDom = document.getElementById('edit-section')
      const computedStyle = getComputedStyle(editorPanelDom as HTMLElement)
      let editorPanelWidth = editorPanelDom?.clientWidth ?? 0
      editorPanelWidth -=
        parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
      const editorEstimatedWidth = Math.min(editorPanelWidth / 2, bgImageSize.width)

      const ratio = editorEstimatedWidth / bgImageSize.width
      setSizeRatio(ratio)
      setStageSize({ width: bgImageSize.width * ratio, height: bgImageSize.height * ratio })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [bgImageSize])

  return (
    <Stage
      className={stage}
      ref={stageRef}
      width={stageSize.width}
      height={stageSize.height}
      scale={{ x: sizeRatio, y: sizeRatio }}
      onClick={onStageClick}
    >
      <Layer>
        <UserImage />
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

const stage = css({
  rounded: 'md',
  overflow: 'hidden',
})
