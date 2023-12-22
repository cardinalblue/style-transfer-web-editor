'use client'

import { useDrop } from 'react-use'
import { css } from '@styled-system/css'
import { UploadButton } from '@/components/controls/UploadButton'
import { useEditorStore } from '@/store'
import { DEMO_IMAGES } from '@/utils/constants'

export const WelcomePanel = () => {
  const { uploadBgImage, updateBgImage } = useEditorStore()

  const onFiles = async (files: File[]) => {
    const file = files[0]
    uploadBgImage(file)
  }

  useDrop({ onFiles })

  return (
    <div className={container}>
      <div className={uploadSection}>
        <UploadButton showPulse={true} />
        <div className={demoImageDesc}>Or choose a demo image</div>
        <div className={imageGroup}>
          {DEMO_IMAGES.map((url, key) => (
            <div
              className={demoImage}
              style={{ backgroundImage: `url(${url})` }}
              key={key}
              onClick={() => updateBgImage(url)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

const container = css({
  flex: 1,
  maxW: '1080px',
  mx: 'auto',
  p: 4,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const uploadSection = css({
  w: '100%',
  maxW: '600px',
  minH: '50%',
  p: 4,
  rounded: '2xl',
  bgColor: '#eee',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
})

const imageGroup = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
})

const demoImageDesc = css({
  mt: 12,
})

const demoImage = css({
  w: '100px',
  h: '100px',
  bg: 'no-repeat center / cover',
  rounded: 'md',
  cursor: 'pointer',
})
