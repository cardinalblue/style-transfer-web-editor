'use client'

import { css } from '@styled-system/css'
import { useStyleTransferStore } from '@/store'
import { Button } from '@/components/basic/Button'
import { DownloadIcon } from '@/components/icons/DownloadIcon'

export const SaveButton = () => {
  const { styleTransferResult } = useStyleTransferStore()

  const onSave = () => {
    if (!styleTransferResult) {
      return
    }

    const link = document.createElement('a')
    link.href = styleTransferResult
    link.download = 'style-trasfer.png'
    link.click()
  }
  return (
    <Button onClick={onSave} isDisabled={!styleTransferResult}>
      <div className={iconWrapper}>
        <DownloadIcon />
      </div>
      Save
    </Button>
  )
}

const iconWrapper = css({
  w: '24px',
})
