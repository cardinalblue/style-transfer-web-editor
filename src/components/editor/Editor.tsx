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

  const getLatestScreenshot = async (ratio = sizeRatio, size = stageSize) => {
    // clone a new stage to make a screenshot
    const cloneStage = stageRef.current?.clone()
    // make sure stage data is up to date
    cloneStage?.setSize(size)
    cloneStage?.setAttrs({ scale: { x: ratio, y: ratio } })
    // remove all transformers
    const cloneLayer = cloneStage?.children?.[0]
    cloneLayer?.children?.forEach((item) => {
      if (item.getClassName() === 'Transformer') {
        item.destroy()
      }
    })

    const uri = cloneStage?.toDataURL({
      pixelRatio: 1 / ratio,
      width: size.width,
      height: size.height,
    })
    updateEditorScreenshot(uri ?? '')
  }

  const onStageClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
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
    if (bgImageSize.width === 0 || bgImageSize.height === 0) {
      return
    }
    const handleResize = async (_?: Event, isInit = false) => {
      const stageContainerDom = document.getElementById('stage-container')
      const width = stageContainerDom?.clientWidth ?? 0
      const ratio = width / bgImageSize.width
      const size = { width, height: bgImageSize.height * ratio }

      setSizeRatio(ratio)
      setStageSize(size)

      if (isInit) {
        getLatestScreenshot(ratio, size)
      }
    }
    handleResize(undefined, true)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [bgImageSize])

  return (
    <div
      className={container}
      style={{
        maxWidth: bgImageSize.width,
        aspectRatio: `${bgImageSize.width} / ${bgImageSize.height}`,
      }}
      id="stage-container"
    >
      <Stage
        className={stage}
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scale={{ x: sizeRatio, y: sizeRatio }}
        onMouseDown={onStageClick}
        onTouchStart={onStageClick}
      >
        <Layer>
          <UserImage />
          {stickerShapes.map((item) => (
            <Sticker
              key={item.id}
              stickerInfo={item}
              isSelected={selectedId === item.id}
              onChange={() => getLatestScreenshot()}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default Editor

// fake box, for calculating the size of the stage
const container = css({
  position: 'relative',
  flex: 1,
})

const stage = css({
  position: 'absolute',
  top: 0,
  left: 0,
  rounded: 'md',
  overflow: 'hidden',
})
