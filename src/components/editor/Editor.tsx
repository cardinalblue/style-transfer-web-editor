'use client'

import { useRef, useEffect, useState } from 'react'
import Konva from 'konva'
import { Stage, Layer, Rect } from 'react-konva'
import { useDebounce } from 'react-use'
import { useEditorStore } from '@/store'
import { css } from '@styled-system/css'
import { UserImage } from './Image'
import { Sticker } from './Sticker'
import { StickerTransformer } from './StickerTransformer'

const Editor = () => {
  const [sizeRatio, setSizeRatio] = useState(1)
  const stageRef = useRef<Konva.Stage>(null)

  const {
    stickerShapes,
    selectedIds,
    bgImage,
    bgImageSize,
    updateSelectedIds,
    removeSticker,
    updateEditorScreenshot,
  } = useEditorStore()

  const [stageSize, setStageSize] = useState({ ...bgImageSize })
  const [transformerNodes, setTransformerNodes] = useState<Konva.Image[]>([])
  const [screenshotTimestamp, setScreenshotTimestamp] = useState(0)

  useEffect(() => {
    const layer = stageRef.current?.children?.[0]
    const nodes = selectedIds.map((id) => layer?.findOne('#' + id)) as Konva.Image[]
    setTransformerNodes(nodes)
  }, [selectedIds])

  useDebounce(
    () => {
      if (screenshotTimestamp) {
        getLatestScreenshot()
      }
    },
    500,
    [screenshotTimestamp]
  )

  const getLatestScreenshot = async (ratio = sizeRatio, size = stageSize) => {
    if (ratio === 0 || size.width === 0 || size.height === 0) {
      return
    }
    // clone a new stage to make a screenshot
    const cloneStage = stageRef.current?.clone()
    // make sure stage data is up to date
    cloneStage?.setSize(size)
    cloneStage?.setAttrs({ scale: { x: ratio, y: ratio } })
    // remove all transformers
    const cloneLayer = cloneStage?.children?.[0]
    cloneLayer?.children?.forEach((item) => {
      if (item.getClassName() === 'Transformer' || item.getClassName() === 'Rect') {
        item.destroy()
      }
    })

    const base64 = cloneStage?.toDataURL({
      pixelRatio: 1 / ratio,
      width: size.width,
      height: size.height,
    })
    updateEditorScreenshot(base64 ?? '')
  }

  const onStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const targetId = e.target.attrs['data-shape-id'] ?? ''
    // check if is selecting
    const { x1, x2, y1, y2 } = selectionDataRef.current
    if ((x1 !== x2 || y1 !== y2) && !targetId) {
      return
    }
    const isShiftKey = e.evt.shiftKey
    updateSelectedIds(targetId, isShiftKey)
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
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [stageRef.current])

  useEffect(() => {
    if (bgImageSize.width === 0 || bgImageSize.height === 0) {
      return
    }

    const handleResize = (_event?: Event, isInit = false) => {
      const stageContainerDom = document.getElementById('result-image')
      const width = stageContainerDom?.clientWidth ?? 100
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

  // multi selection
  const selectionRectRef = useRef<Konva.Rect>(null)
  const selectionDataRef = useRef({ x1: 0, y1: 0, x2: 0, y2: 0, visible: false })

  const updateSelectionRectAttrs = () => {
    const node = selectionRectRef.current
    node?.setAttrs({
      visible: selectionDataRef.current.visible,
      x: Math.min(selectionDataRef.current.x1, selectionDataRef.current.x2) / sizeRatio,
      y: Math.min(selectionDataRef.current.y1, selectionDataRef.current.y2) / sizeRatio,
      width: Math.abs(selectionDataRef.current.x1 - selectionDataRef.current.x2) / sizeRatio,
      height: Math.abs(selectionDataRef.current.y1 - selectionDataRef.current.y2) / sizeRatio,
    })
  }

  const onStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target?.attrs.id !== 'bg-image') {
      return
    }
    const pos = e.target?.getStage()?.getPointerPosition()
    selectionDataRef.current.visible = true
    selectionDataRef.current.x1 = pos?.x ?? 0
    selectionDataRef.current.y1 = pos?.y ?? 0
    selectionDataRef.current.x2 = pos?.x ?? 0
    selectionDataRef.current.y2 = pos?.y ?? 0
    updateSelectionRectAttrs()
  }

  const onStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!selectionDataRef.current.visible) {
      return
    }
    const pos = e.target?.getStage()?.getPointerPosition()
    selectionDataRef.current.x2 = pos?.x ?? 0
    selectionDataRef.current.y2 = pos?.y ?? 0
    updateSelectionRectAttrs()
  }

  const onStageMouseUp = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!selectionDataRef.current.visible) {
      return
    }

    selectionDataRef.current.visible = false
    updateSelectionRectAttrs()

    const { x1, x2, y1, y2 } = selectionDataRef.current
    if (x1 === x2 && y1 === y2) {
      return
    }

    const selectionBox = selectionRectRef.current?.getClientRect()!
    const layer = stageRef.current?.children?.[0]
    layer?.children?.forEach((item) => {
      const elBox = item.getClientRect()
      const isIntersect = Konva.Util.haveIntersection(selectionBox, elBox)
      const isSticker = item.attrs['data-shape-id'] ?? false
      const isNotSelected = !selectedIds.includes(item.attrs.id)
      if (isIntersect && isSticker && isNotSelected) {
        updateSelectedIds(item.attrs.id, true)
      }
    })
  }

  return (
    <div className={container}>
      <Stage
        className={stage}
        style={{ backgroundImage: `url(${bgImage})` }}
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scale={{ x: sizeRatio, y: sizeRatio }}
        onClick={onStageClick}
        onTap={onStageClick}
        // handle multi-select with dragging area
        onMouseDown={onStageMouseDown}
        onMouseMove={onStageMouseMove}
        onMouseUp={onStageMouseUp}
        onMouseLeave={onStageMouseUp}
        onTouchStart={onStageMouseDown}
        onTouchMove={onStageMouseMove}
        onTouchEnd={onStageMouseUp}
      >
        <Layer>
          <UserImage />
          {stickerShapes.map((item) => (
            <Sticker
              key={item.id}
              stickerInfo={item}
              onChange={() => setScreenshotTimestamp(Date.now())}
            />
          ))}
          <StickerTransformer nodes={transformerNodes} />
          <Rect
            ref={selectionRectRef}
            fill="rgba(0, 162, 255, 0.2)"
            strokeWidth={1}
            stroke="rgba(0, 162, 255)"
          />
        </Layer>
      </Stage>
    </div>
  )
}

export default Editor

const container = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const stage = css({
  rounded: 'md',
  overflow: 'hidden',
  width: 'fit-content',
  height: 'fit-content',
  bg: 'no-repeat center / contain',
})
