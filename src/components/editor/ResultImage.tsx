'use client'

import { useEffect } from 'react'
import { css } from '@styled-system/css'
import { useQuery } from '@tanstack/react-query'

import { useEditorStore, useStyleTransferStore } from '@/store'

export const ResultImage = () => {
  const { bgImageSize, editorScreenshot } = useEditorStore()
  const { userPrompt, styleTransferResult, applyStyleTransfer, updateStyleTransferResult } =
    useStyleTransferStore()

  const {
    data: styletransferRes,
    isFetching,
    refetch: getResultImage,
  } = useQuery({
    queryKey: ['style-transfer'],
    queryFn: applyStyleTransfer,
    enabled: false,
  })

  useEffect(() => {
    if (styletransferRes) {
      updateStyleTransferResult(styletransferRes)
    }
  }, [styletransferRes])

  useEffect(() => {
    if (editorScreenshot && userPrompt) {
      getResultImage()
    }
  }, [editorScreenshot, userPrompt])

  return (
    <div
      className={image}
      style={{
        maxWidth: bgImageSize.width,
        aspectRatio: `${bgImageSize.width} / ${bgImageSize.height}`,
        backgroundImage: `url(${styleTransferResult})`,
      }}
    >
      {isFetching && <div className={loadingMask}></div>}
    </div>
  )
}

const image = css({
  position: 'relative',
  flex: 1,
  rounded: 'md',
  background: 'no-repeat center / contain',
  overflow: 'hidden',
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
