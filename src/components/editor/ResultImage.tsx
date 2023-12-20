'use client'

import { useRef, useEffect } from 'react'
import { css } from '@styled-system/css'
import { useQuery } from '@tanstack/react-query'

import { useEditorStore, useStyleTransferStore } from '@/store'

export const ResultImage = () => {
  const { editorSize, editorScreenshot, resultImage, updateResultImage } = useEditorStore()
  const { applyStyleTransfer } = useStyleTransferStore()

  const abortController = useRef<AbortController | null>(null)

  const {
    data: styletransferRes,
    isFetching,
    error,
    refetch: getResultImage,
  } = useQuery({
    queryKey: ['style-transfer'],
    queryFn: () => {
      abortController.current?.abort()
      abortController.current = new AbortController()
      return applyStyleTransfer(editorScreenshot, abortController.current?.signal)
    },
    enabled: false,
  })

  useEffect(() => {
    if (styletransferRes) {
      updateResultImage(styletransferRes)
    }
  }, [styletransferRes])

  useEffect(() => {
    if (editorScreenshot) {
      getResultImage()
    }
  }, [editorScreenshot])

  return (
    <div
      className={image}
      style={{
        width: editorSize.width,
        aspectRatio: `${editorSize.width} / ${editorSize.height}`,
        backgroundImage: `url(${resultImage})`,
      }}
    >
      {isFetching && <div className={loadingMask}></div>}
    </div>
  )
}

const imageWrapper = css({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const image = css({
  background: 'no-repeat center / contain',
  position: 'relative',
})

const loadingMask = css({
  position: 'absolute',
  top: 0,
  left: 0,
  w: '100%',
  h: '100%',
  bg: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  _before: {
    content: '""',
    w: '36px',
    h: '36px',
    border: '5px solid #F5F4EF',
    rounded: '50%',
    borderTopColor: 'transparent',
    animation: 'loadingSpin 0.8s linear infinite',
  },
})
