'use client'

import { useEffect } from 'react'
import NextImage from 'next/image'
import { css } from '@styled-system/css'
import { useQuery } from '@tanstack/react-query'
import { useEditorStore, useStyleTransferStore } from '@/store'

export const ResultImage = () => {
  const { bgImage, bgImageSize, editorScreenshot } = useEditorStore()
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
    <div className={container}>
      <div
        id="result-image"
        className={imageWrapper}
        style={{ aspectRatio: `${bgImageSize.width} / ${bgImageSize.height}` }}
      >
        {!!(styleTransferResult || bgImage) && (
          <NextImage
            src={styleTransferResult || bgImage}
            alt=""
            width={bgImageSize.width}
            height={bgImageSize.height}
            unoptimized
            className={imageStyle}
          />
        )}
        {isFetching && <div className={loadingMask}></div>}
      </div>
    </div>
  )
}

const container = css({
  flex: 1,
  w: '100%',
  h: '100%',
  overflow: 'hidden',
  maxH: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const imageWrapper = css({
  position: 'relative',
  maxW: '100%',
  maxH: '100%',
  rounded: 'md',
  overflow: 'hidden',
})

const imageStyle = css({
  display: 'block',
  w: '100%',
  h: '100%',
  objectFit: 'contain',
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
