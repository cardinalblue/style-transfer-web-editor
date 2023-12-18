'use client'

import { useRef, useEffect, useState } from 'react'
import Konva from 'konva'
import { Stage, Layer } from 'react-konva'
import { css } from '@styled-system/css'
import { UserImage } from './Image'
import { Sticker } from './Sticker'

export const Editor = () => {
  const [scale, setScale] = useState({ x: 0.5, y: 0.5 })
  const [size, setSize] = useState({ width: 0, height: 0 })
  const stageRef = useRef<Konva.Stage>(null)
  const [exportUri, setExportUri] = useState<string>('')

  const onSave = () => {
    const uri = stageRef.current?.toDataURL() ?? ''
    setExportUri(uri)
  }

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight })
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <button onClick={onSave}>on save</button>
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        className={container}
        scale={scale}
      >
        <Layer>
          <UserImage />
          <Sticker />
        </Layer>
      </Stage>
      <div
        style={{
          width: '500px',
          height: '500px',
          background: `url(${exportUri}) no-repeat center / contain`,
        }}
      ></div>
    </>
  )
}

const container = css({
  bgColor: 'wheat',
})
