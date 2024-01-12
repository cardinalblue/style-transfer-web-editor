'use client'

import { useEffect, useRef } from 'react'
import Konva from 'konva'
import { Transformer } from 'react-konva'
import { css } from '@styled-system/css'

interface TransformerProps {
  nodes: Konva.Image[]
}

export const StickerTransformer = ({ nodes }: TransformerProps) => {
  const trRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    return () => {
      trRef.current?.destroy()
    }
  }, [])

  return (
    <>
      {!!nodes.length && (
        <Transformer
          ref={trRef}
          nodes={nodes}
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
