'use client'

import { css } from '@styled-system/css'
import { UploadButton } from '@/components/controls/UploadButton'
import { useEditorStore } from '@/store'

const demoImages = [
  'https://images.pexels.com/photos/17201961/pexels-photo-17201961/free-photo-of-tables-and-chairs-near-restaurant.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/19404699/pexels-photo-19404699/free-photo-of-a-couple-sitting-on-a-meadow-and-hugging.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/4422100/pexels-photo-4422100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
]

export const WelcomePanel = () => {
  const { updateBgImage } = useEditorStore()
  return (
    <div className={container}>
      <UploadButton />
      <div>or choose a demo image</div>
      <div className={imageGroup}>
        {demoImages.map((url, key) => (
          <div
            className={demoImage}
            style={{ backgroundImage: `url(${url})` }}
            key={key}
            onClick={() => updateBgImage(url)}
          ></div>
        ))}
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

const demoImage = css({
  w: '100px',
  h: '100px',
  bg: 'no-repeat center / cover',
  rounded: 'md',
  cursor: 'pointer',
})
